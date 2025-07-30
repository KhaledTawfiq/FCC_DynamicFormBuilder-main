import React, { useState } from 'react';
import { Section, ActionButtons, FormConfiguration, JsonModal, Snackbar } from './index';
import type { Section as SectionType, FormConfig } from '../types';
import { DEFAULT_FORM_CONFIG } from '../config/constants';

/**
 * Main Form Builder Component
 * Complete form builder with configuration, sections, and actions
 */
const MainFormBuilder: React.FC = () => {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [nextSectionId, setNextSectionId] = useState(1);
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [generatedJsonData, setGeneratedJsonData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const addSection = () => {
    const newSection: SectionType = {
      id: String(nextSectionId),
      title: `Section ${nextSectionId}`,
      fields: [],
      formData: '[]'
    };
    setSections(prev => [...prev, newSection]);
    setNextSectionId(prev => prev + 1);
  };

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, updatedSection: SectionType) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? updatedSection : section
    ));
  };

  const handleViewJson = () => {
    try {
      const jsonData = JSON.stringify(sections, null, 2);
      setGeneratedJsonData(jsonData);
      setShowJsonModal(true);
      showNotification('JSON generated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to generate JSON', 'error');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', sections);
      showNotification('Form submitted successfully!', 'success');
    } catch (error) {
      showNotification('Form submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            if (Array.isArray(jsonData)) {
              setSections(jsonData);
            }
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
            <p className="text-muted">Click "Add Section" to get started building your form</p>
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons - Positioned below sections like the original */}
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
