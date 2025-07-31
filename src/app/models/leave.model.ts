export interface Leave {
  id: number;
  employeeName: string;
  leaveType: string;
  startDate: string;  // Format: YYYY-MM-DD
  endDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}
