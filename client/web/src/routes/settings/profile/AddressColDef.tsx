import {GridColDef} from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {field: 'bno', headerName: 'Building No', minWidth: 70},
  {field: 'st', headerName: 'Street', minWidth: 130, flex: 1},
  {field: 'line1', headerName: 'Line 1', minWidth: 130, flex: 1},
  {field: 'line2', headerName: 'Line 2', minWidth: 130, flex: 1},
  {field: 'ldmk', headerName: 'Landmark', minWidth: 70},
  {field: 'city', headerName: 'City', minWidth: 70},
  {field: 'state', headerName: 'State', minWidth: 70},
  {field: 'country', headerName: 'Country', minWidth: 70},
  {field: 'pncd', headerName: 'Pincode', minWidth: 70},
];

export default columns;
