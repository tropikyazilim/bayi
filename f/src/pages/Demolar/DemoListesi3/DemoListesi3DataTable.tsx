
import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { type Person } from './DemoListesi3';
import { MRT_Localization_TR } from 'material-react-table/locales/tr';

interface DemoListesi3DataTableProps {
  columns: MRT_ColumnDef<Person>[];
  data: Person[];
  refetch?: () => void;
}

export default function DemoListesi3DataTable({ columns, data, refetch }: DemoListesi3DataTableProps) {
  
  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnResizing: true,
    enableFilters: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableColumnActions: true,
    enableColumnDragging: true,
    enableColumnOrdering: true,
    enableRowSelection: true,
    enableFacetedValues: true,
    muiTableBodyRowProps: { hover: true },
    localization: MRT_Localization_TR,
  });

  return <MaterialReactTable table={table} />;
};

