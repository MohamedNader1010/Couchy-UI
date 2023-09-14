export interface DashboardStatistics {
    totalAdmins: number; 
    totalUsers: number; 
    totalTrainers: number; 
    totalPackages: number;
    top5Trainers?: string[]; 
    top5Categories?: string[]; 
    totalIncome: number;
    totalSubscribedUsers:number;
}