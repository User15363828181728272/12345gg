
import { PTERO_APPLICATION_KEY, PTERO_CLIENT_KEY } from '../constants';

// Fixed proxy paths to ensure no trailing slash mismatches
const CLIENT_API_BASE = '/ptero-api/client';
const APP_API_BASE = '/ptero-api/app';

const getHeaders = (key: string) => ({
  'Authorization': `Bearer ${key}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

export const getClientServers = async () => {
  try {
    const response = await fetch(`${CLIENT_API_BASE}`, {
      method: 'GET',
      headers: getHeaders(PTERO_CLIENT_KEY)
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.map((s: any) => ({
      id: s.attributes.identifier,
      name: s.attributes.name,
      status: s.attributes.is_suspended ? 'suspended' : 'active',
      limits: s.attributes.limits,
      daysRemaining: 30
    }));
  } catch (error) {
    console.error("Client API Fetch Error:", error);
    return [];
  }
};

export const getTotalServersCount = async (): Promise<number> => {
  try {
    // Calling /servers endpoint on Application API via proxy
    const response = await fetch(`${APP_API_BASE}/servers`, {
      method: 'GET',
      headers: getHeaders(PTERO_APPLICATION_KEY)
    });
    
    if (!response.ok) {
      console.warn(`Pterodactyl API 404/Error: ${response.status} at /servers`);
      return 0;
    }
    
    const data = await response.json();
    return data?.meta?.pagination?.total ?? 0;
  } catch (error) {
    console.error("Application API Fetch Error:", error);
    return 0;
  }
};

export const createPterodactylServer = async (userData: {
  username: string;
  email: string;
  serverName: string;
  ram: number;
  disk: number;
}) => {
  // 1. User Provisioning
  const userRes = await fetch(`${APP_API_BASE}/users`, {
    method: 'POST',
    headers: getHeaders(PTERO_APPLICATION_KEY),
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      first_name: userData.username,
      last_name: 'C6R12-User',
      password: 'p' + Math.floor(Math.random() * 999999) + '!'
    })
  });

  let userInfo = await userRes.json();
  let userId = userInfo.attributes?.id;

  // Search existing user if collision
  if (!userId && userInfo.errors?.[0]?.code === 'ValidationException') {
     const searchRes = await fetch(`${APP_API_BASE}/users?filter[username]=${userData.username}`, {
        headers: getHeaders(PTERO_APPLICATION_KEY)
     });
     const searchData = await searchRes.json();
     userId = searchData.data?.[0]?.attributes?.id;
  }

  if (!userId) throw new Error('Global User ID allocation failed');

  // 2. Server Cluster Deployment
  const serverRes = await fetch(`${APP_API_BASE}/servers`, {
    method: 'POST',
    headers: getHeaders(PTERO_APPLICATION_KEY),
    body: JSON.stringify({
      name: userData.serverName,
      user: userId,
      egg: 15, // C6R12 Primary Egg
      docker_image: 'ghcr.io/pterodactyl/yolks:nodejs_18',
      startup: 'if [[ -f package.json ]]; then npm install; fi; node index.js',
      limits: {
        memory: userData.ram * 1024,
        swap: 0,
        disk: userData.disk * 1024,
        io: 500,
        cpu: 0 // Default to 0 (Unlimited) for isolated performance
      },
      environment: { STARTUP_FILE: 'index.js' },
      feature_limits: { databases: 1, allocations: 1, backups: 1 },
      deploy: { locations: [1], dedicated_ip: false, port_range: [] }
    })
  });

  if (!serverRes.ok) {
    const errData = await serverRes.json();
    throw new Error(errData.errors?.[0]?.detail || 'Resource allocation failed at node level');
  }

  return await serverRes.json();
};
