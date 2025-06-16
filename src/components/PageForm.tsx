import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { type PageFormData, getPageFormData, updatePageFormData } from "~/lib/store";

interface PageFormProps {
  pageId: string;
  fields: string[];
  onFormChange?: (formData: PageFormData) => void;
}

export const PageForm = ({ pageId, fields, onFormChange }: PageFormProps) => {
  // Get initial form data from store
  const initialFormData = getPageFormData(pageId);

  const form = useForm({
    defaultValues: initialFormData as Record<string, string>,
    onSubmit: async ({ value }) => {
      // Update store with form data
      updatePageFormData(pageId, value as PageFormData);
      onFormChange?.(value as PageFormData);
    },
  });

  // Auto-save form data when values change
  useEffect(() => {
    const subscription = form.store.subscribe(() => {
      const currentValues = form.state.values;
      if (currentValues && Object.keys(currentValues).length > 0) {
        updatePageFormData(pageId, currentValues as PageFormData);
        onFormChange?.(currentValues as PageFormData);
      }
    });

    return () => subscription();
  }, [form, pageId, onFormChange]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Form Fields:</h3>
      {fields.map((field, index) => {
        const fieldName = field.toLowerCase().replace(/\s+/g, "_");
        const fieldId = `${pageId}-field-${index}`;

        return (
          <form.Field key={fieldId} name={fieldName}>
            {(field) => (
              <div className="border border-gray-200 rounded-lg p-4">
                <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  id={fieldId}
                  type="text"
                  value={(field.state.value as string) || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${field.name.replace(/_/g, " ").toLowerCase()}`}
                />
                {field.state.meta.errors.length > 0 && (
                  <div className="mt-1 text-sm text-red-600">
                    {field.state.meta.errors.join(", ")}
                  </div>
                )}
              </div>
            )}
          </form.Field>
        );
      })}
    </div>
  );
};
