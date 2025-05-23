"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, children, ...props }, ref) => {
  // Filter out any whitespace nodes in children
  const filteredChildren = React.Children.toArray(children).filter(
    child => typeof child !== 'string' || child.trim() !== ''
  );
  
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full table-fixed border-separate border-spacing-0 caption-bottom text-sm border-collapse", className)}
        {...props}
      >
        {filteredChildren}
      </table>
    </div>
  );
});
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  // Filter out whitespace nodes
  const filteredChildren = React.Children.toArray(children).filter(
    child => typeof child !== 'string' || child.trim() !== ''
  );
  
  return (
    <thead 
      ref={ref} 
      className={cn("[&_tr]:border-b bg-muted/50", className)} 
      {...props}
    >
      {filteredChildren}
    </thead>
  );
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, children, ...props }, ref) => {
  // Filter out whitespace nodes
  const filteredChildren = React.Children.toArray(children).filter(
    child => typeof child !== 'string' || child.trim() !== ''
  );
  
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    >
      {filteredChildren}
    </tbody>
  );
});
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  // Filter out whitespace nodes
  const filteredChildren = React.Children.toArray(children).filter(
    child => typeof child !== 'string' || child.trim() !== ''
  );
  
  return (
    <tfoot
      ref={ref}
      className={cn("bg-primary font-medium text-primary-foreground", className)}
      {...props}
    >
      {filteredChildren}
    </tfoot>
  );
});
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, children, ...props }, ref) => {
  // Filter out whitespace nodes
  const filteredChildren = React.Children.toArray(children).filter(
    child => typeof child !== 'string' || child.trim() !== ''
  );
  
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted whitespace-nowrap",
        className
      )}
      {...props}
    >
      {filteredChildren}
    </tr>
  );
});
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-8 px-1 text-left align-middle font-semibold text-sm text-muted-foreground whitespace-nowrap border-r border-white/50 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] overflow-hidden",
      // Resize elementlerini sadece hover durumunda göster
      "[&_*[class*='resize']]:opacity-0 hover:[&_*[class*='resize']]:opacity-100",
      "[&_*[class*='handle']]:opacity-0 hover:[&_*[class*='handle']]:opacity-100",
      "[&_.resize]:opacity-0 hover:[&_.resize]:opacity-100",
      "[&_.handle]:opacity-0 hover:[&_.handle]:opacity-100",
      className
    )}
    
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-1 px-1 align-middle whitespace-nowrap text-sm font-normal border-b border-r border-gray-200 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] last:border-r-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
}
