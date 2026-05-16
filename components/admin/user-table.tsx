"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleType: number;
  roleName: string;
  isActive: boolean;
}

interface UserTableProps {
  users: User[];
  onToggleActive: (userId: number, active: boolean) => void;
  onEditRole?: (user: User) => void;
}

const SYSTEM_ADMIN_ID = 1;

export function UserTable({
  users,
  onToggleActive,
  onEditRole,
}: UserTableProps) {
  return (
    <ScrollArea className="bg-card">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-[90px] text-left tableHead">
              User ID
            </TableHead>
            <TableHead className="min-w-[180px] text-left tableHead">
              Name
            </TableHead>
            <TableHead className="min-w-[260px] text-left tableHead">
              Email
            </TableHead>
            <TableHead className="w-[140px] text-left tableHead">
              Role
            </TableHead>
            <TableHead className="w-[130px] text-center tableHead">
              Status
            </TableHead>
            <TableHead className="w-[260px] text-center tableHead">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-28 text-center text-sm text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const isSystemAdmin = user.userId === SYSTEM_ADMIN_ID;

              return (
                <TableRow key={user.userId} className="hover:bg-muted/30">
                  <TableCell className="font-medium text-muted-foreground">
                    #{user.userId}
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>

                  <TableCell>
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {user.roleName}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={
                        user.isActive
                          ? "rounded-md bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400"
                          : "rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isSystemAdmin}
                        onClick={() =>
                          onToggleActive(user.userId, !user.isActive)
                        }
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>

                      {onEditRole && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isSystemAdmin}
                          onClick={() => onEditRole(user)}
                        >
                          Change Role
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
