import React, { useState } from "react";
import {
  Section,
  ActionButtons,
  FormConfiguration,
  JsonModal,
  Snackbar,
} from "./index";
import type { Section as SectionType, FormConfig } from "../types";
import { DEFAULT_FORM_CONFIG } from "../config/constants";
import { useFormDataGenerator } from "@/hooks/utils/formDataGenerator";

/**
 * Main Form Builder Component
 * Updated to output elements in both array and object formats
 */
const MainFormBuilder: React.FC = () => {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [nextSectionId, setNextSectionId] = useState(1);
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [generatedJsonData, setGeneratedJsonData] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Use the updated form data generator
  const { generateFormData } = useFormDataGenerator();

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const addSection = () => {
    const newSection: SectionType = {
      id: String(nextSectionId),
      title: `Section ${nextSectionId}`,
    };
    setSections((prev) => [...prev, newSection]);
    setNextSectionId((prev) => prev + 1);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, updatedSection: SectionType) => {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? updatedSection : section))
    );
  };
  const reorderSections = (fromIndex: number, toIndex: number) => {
    setSections((prev) => {
      const updatedSections = [...prev];
      const [movedSection] = updatedSections.splice(fromIndex, 1);
      updatedSections.splice(toIndex, 0, movedSection);
      return updatedSections;
    });
  };

  const handleViewJson = () => {
    try {
      if (!sections.length) {
        showNotification("you should add a section first", "warning");
        return;
      }
      // Format as JSON string with proper indentation
      const jsonData = JSON.stringify(
        generateFormData(formConfig, sections),
        null,
        2
      );
      setGeneratedJsonData(jsonData);
      showNotification("JSON generated successfully!", "success");
      setShowJsonModal(true);

      console.log("Combined JSON:", jsonData);
    } catch (error) {
      console.error("Error generating JSON:", error);
      showNotification("Failed to generate JSON", "error");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate the elements for submission

      // Simulate API call with the new format
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showNotification("Form submitted successfully!", "success");
    } catch (error) {
      console.error("Form submission error:", error);
      showNotification("Form submission failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);

            // Handle both array format (new) and object format (old)
            let elementsToLoad: any[] = [];
            let loadedSections: SectionType[] = [];

            if (jsonData.elements && Array.isArray(jsonData.elements)) {
              // New format - array of elements
              elementsToLoad = jsonData.elements;
            } else if (jsonData.form && jsonData.form.sections) {
              // Old format - extract elements from sections
              loadedSections = jsonData.form.sections;
              loadedSections.forEach((section: any) => {
                if (section.elements && Array.isArray(section.elements)) {
                  elementsToLoad = elementsToLoad.concat(section.elements);
                }
              });
            } else if (Array.isArray(jsonData)) {
              // Direct array format
              elementsToLoad = jsonData;
            } else {
              throw new Error("Invalid JSON format");
            }

            // Create sections from loaded data
            if (elementsToLoad.length > 0) {
              const newSection: SectionType = {
                id: String(Date.now()),
                title: "Loaded Section",
                fields: [],
                formData: JSON.stringify(elementsToLoad),
              };

              // Add the elements property for compatibility
              (newSection as any).elements = elementsToLoad;

              setSections(
                loadedSections.length > 0 ? loadedSections : [newSection]
              );
              showNotification("JSON loaded successfully!", "success");
            } else {
              showNotification("No valid elements found in JSON", "error");
            }
          } catch (error) {
            console.error("JSON parsing error:", error);
            showNotification("Invalid JSON file", "error");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

    // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    // Update drag visual feedback if needed
  };

  const handleDrop = (index: number) => {
    setDraggedIndex(null);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    reorderSections(fromIndex, toIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="form-builder-container">
      {/* Form Configuration */}
      <FormConfiguration
        formConfig={formConfig}
        onConfigChange={setFormConfig}
      />

      {/* Sections */}
      <div className="sections-container">
        {sections.length === 0 ? (
          <div className="empty-state text-center py-5">
            <h4 className="text-muted">No sections yet</h4>
            <p className="text-muted">
              Click "Add Section" to get started building your form
            </p>
          </div>
        ) : (
          <div className="accordion sections-accordion" id="sectionsAccordion">
            {sections.map((section, index) => (
              <Section
                key={section.id}
                section={section}
                index={index}
                formBuilderOptions={{}}
                onRemove={removeSection}
                onUpdate={updateSection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onReorder={handleReorder}
                draggedIndex={draggedIndex}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-container mt-4">
        <ActionButtons
          onAddSection={addSection}
          onViewJson={handleViewJson}
          onSubmit={handleSubmit}
          onLoadJson={handleLoadJson}
          isSubmitting={isSubmitting}
          isLoading={false}
        />
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <JsonModal
          isOpen={showJsonModal}
          onClose={() => setShowJsonModal(false)}
          jsonData={generatedJsonData}
          title="Form Elements JSON"
        />
      )}

      {/* Notifications */}
      {notification && (
        <Snackbar
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
};

export default MainFormBuilder;
