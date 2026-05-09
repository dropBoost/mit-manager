'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaPlus } from "react-icons/fa";

export function DialogGeneric({ label, data, title, description, labelClose }) {

  const isPlus = label === "plus";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size={isPlus ? "icon" : "default"}>
          {isPlus ? <FaPlus /> : label}
        </Button>
      </DialogTrigger>

      <DialogContent className="xl:max-w-6xl! max-w-[calc(100%-6rem)]! max-h-[calc(100vh-8rem)] overflow-y-auto">
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {data}

        {labelClose && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {labelClose}
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}