"use client";

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useState } from "react";
import { useGetAppealsQuery, useAddAppealMutation, useUpdateAppealMutation, useDeleteAppealMutation, Appeal } from "@/store/appealsApi";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";

export default function AppealsTable() {
  const { data: appeals = [], isLoading } = useGetAppealsQuery(undefined, { refetchOnMountOrArgChange: false });
  const [addAppeal] = useAddAppealMutation();
  const [updateAppeal] = useUpdateAppealMutation();
  const [deleteAppeal] = useDeleteAppealMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppeal, setEditingAppeal] = useState<Appeal | null>(null);
  const [formData, setFormData] = useState<Appeal>({
    taxYear: new Date().getFullYear(),
    company: "",
    state: "",
    assessor: "",
    accountNumber: "",
    appealed: false,
  });

  const openAddModal = () => {
    setEditingAppeal(null);
    setFormData({
      taxYear: new Date().getFullYear(),
      company: "",
      state: "",
      assessor: "",
      accountNumber: "",
      appealed: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (appeal: Appeal) => {
    setEditingAppeal(appeal);
    setFormData(appeal);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingAppeal) {
      await updateAppeal(formData);
    } else {
      await addAppeal(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm("Are you sure you want to delete this appeal?")) {
      await deleteAppeal(id);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-4">
        <Input variant="bordered" className="input shadow-none me-5 max-w-[300px]" placeholder="Search by property" startContent={<LuSearch className="text-default-400 pointer-events-none shrink-0" />} type="text" />
        <Button startContent={<FiPlus />} color="primary" onPress={openAddModal}>
          Add Appeal
        </Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <Table className="appeals-table" aria-label="Appeals table">
            <TableHeader>
              <TableColumn>Tax Year</TableColumn>
              <TableColumn>Company</TableColumn>
              <TableColumn>State</TableColumn>
              <TableColumn>Assessor</TableColumn>
              <TableColumn>Account #</TableColumn>
              <TableColumn>Appealed</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {appeals.map((appeal) => (
                <TableRow key={appeal.id} className="border-b border-default-100 last:border-b-0">
                  <TableCell>{appeal.taxYear}</TableCell>
                  <TableCell>{appeal.company}</TableCell>
                  <TableCell>{appeal.state}</TableCell>
                  <TableCell>{appeal.assessor}</TableCell>
                  <TableCell>{appeal.accountNumber}</TableCell>
                  <TableCell>{appeal.appealed ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button isIconOnly size="sm" variant="light" onPress={() => openEditModal(appeal)}>
                      <FiEdit />
                    </Button>
                    <Button isIconOnly size="sm" color="danger" variant="light" onPress={() => handleDelete(appeal.id)}>
                      <FiTrash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{editingAppeal ? "Edit Appeal" : "Add Appeal"}</ModalHeader>
          <ModalBody>
            <Input label="Tax Year" type="number" value={String(formData.taxYear)} onChange={(e) => setFormData({ ...formData, taxYear: Number(e.target.value) })} />
            <Input label="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
            <Input label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            <Input label="Assessor" value={formData.assessor} onChange={(e) => setFormData({ ...formData, assessor: e.target.value })} />
            <Input label="Account Number" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
            <Switch isSelected={formData.appealed} onValueChange={(val) => setFormData({ ...formData, appealed: val })}>
              Appealed
            </Switch>
          </ModalBody>
          <ModalFooter>
            <Button className="text-white" color="default" onPress={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
