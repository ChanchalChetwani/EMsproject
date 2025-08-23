export interface Leave {
  id: number;
  employeeId: string;
  name: string;          // ✅ Add this
  employeeName: string;
  leaveType: string;
  startDate: string; // ✅ Add this
  endDate: string;   // ✅ Add this if needed
  selected?: boolean; // ✅ For checkbox functionality
   balance: string;       // ✅ Add this
    status: 'Approved' | 'Pending' | 'Rejected';
}
