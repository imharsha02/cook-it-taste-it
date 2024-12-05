import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TypographyP } from "@/components/ui/Typography/TypographyP";
import { Button } from "@/components/ui/button";

interface AlertDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onOkClick: () => void;
  onAlreadyUserClick: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  onOkClick,
  onAlreadyUserClick,
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to Cook it Taste it!
          </DialogTitle>
        </DialogHeader>
        <TypographyP className="text-muted-foreground">
          Sign up to add your own recipes and share them with the world. Join
          our community of food enthusiasts!
        </TypographyP>
        <DialogFooter>
          <Button onClick={onOkClick} className="hover:cursor-pointer" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg" className="border hover:cursor-pointer" onClick={onAlreadyUserClick}>
            Sing in instead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
