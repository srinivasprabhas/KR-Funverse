"use client";

import { RotateCcwIcon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useResetDemo } from "@/lib/dashboard/store";

/** Restores the seeded demo data — useful when demoing the same flow repeatedly. */
export function ResetDemoButton() {
  const reset = useResetDemo();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<SidebarMenuButton tooltip="Reset demo data" />}
      >
        <RotateCcwIcon />
        <span>Reset demo</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
          <AlertDialogDescription>
            This discards every game and booking you have created and restores
            the original sample data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              reset();
              toast.success("Demo data restored");
            }}
          >
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
