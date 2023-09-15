export interface DashboardStatistics {
    totalAdmins: number; 
    totalUsers: number; 
    totalTrainers: number; 
    totalPackages: number;
    top5Trainers?: TrainerDashboardDto[]; 
    top5Categories?: string[]; 
    totalIncome: number;
    totalSubscribedUsers:number;
}

interface TrainerDashboardDto {
    id: string; 
    name: string; 
    filePath: string;
}