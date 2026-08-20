import { useState } from "react";
import Button from "../../ui/Button.jsx";
import Modal from "../../ui/Modal.jsx";
import CategoriesTable from "./CategoriesTable.jsx";
import AddCategoryModal from "./AddCategoryModal.jsx";
import { useGetCategories } from "./useGetCategories.js";
import { useAddCategory } from "./useAddCategory.js";
import Spinner from "../../ui/Spinner.jsx";

function CategoryContainer() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { addCategory, isPending: isAddingCategory } = useAddCategory({
    onSuccess: () => setIsAddModalOpen(false),
  });

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useGetCategories();

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add new category
        </Button>
      </div>
      {isLoading && <Spinner label="Loading categories" />}
      {isError && (
        <p className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
          {error.message || "Unable to load categories."}
        </p>
      )}
      {!isLoading && !isError && !categories.length && (
        <p className="text-sm text-[var(--color-text-muted)]">
          No categories have been created yet.
        </p>
      )}
      {!isLoading && !isError && categories.length > 0 && (
        <CategoriesTable categories={categories} />
      )}
      <Modal
        isOpen={isAddModalOpen}
        isPending={isAddingCategory}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AddCategoryModal
          isPending={isAddingCategory}
          onAddCategory={addCategory}
        />
      </Modal>
    </>
  );
}

export default CategoryContainer;
