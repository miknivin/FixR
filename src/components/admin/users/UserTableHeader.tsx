"use client";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import AddUserForm from "../forms/AddUserForm";

export default function UserTableHeader() {
const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 items-start justify-end lg:items-center w-full">
        <div className="flex justify-between items-center gap-3 flex-wrap-reverse">
          {/* <SearchInput/> */}
          <div className="flex gap-2">
          {/* < Button  size="sm" variant="outline" endIcon={<FilterIcons/>}>
           Filter 
          </Button> */}
          <Button size="sm" variant="primary" onClick={() => setIsAddUserModalOpen(true)}>
            Add Users
          </Button>
          </div>
        </div>
        <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        className=" max-w-xl"
        showCloseButton={true}
      >
        <AddUserForm onClose={() => setIsAddUserModalOpen(false)} />
      </Modal>
      </div>
    </>
  );
}