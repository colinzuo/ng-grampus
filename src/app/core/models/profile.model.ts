export interface Profile {
    id: number;
    name: string;
    passwordModifiedByUser: boolean;
    displayName: string;
    email: string;
    telephone: string;
    cellphone: string;
    description: string;
    status: number;
    createTime: number;
    lastModifiedTime: number;
    version: number;
    role: string;
    roomId: number;
    orgId: number;
    orgShortName: string;
    orgPortAllocMode: string;
    orgPortCount: number;
    agentId: number;
    agentShortName: string;
    deptId: number;
    deptShortName: string;
    roomCount: number;
    totalRoomCapacity: number;
    maxRoomCapacity: number;
    type: string;
}