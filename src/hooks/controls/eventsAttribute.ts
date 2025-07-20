/**
 * Events custom attribute for FormBuilder
 * Enhances the events text input with a JSON editor supporting multiple events
 */

export const registerEventsAttribute = (): void => {
  if (typeof window !== 'undefined' && window.document) {
    
    // Function to enhance events input fields
    function enhanceEventsFields() {
      const eventsInputs = document.querySelectorAll('input[name="events"]:not([data-enhanced])') as NodeListOf<HTMLInputElement>;
      
      eventsInputs.forEach(input => {
        input.setAttribute('data-enhanced', 'true');
        
        // Parse current value or use default
        let eventsArray: any[];
        try {
          const parsed = input.value ? JSON.parse(input.value) : null;
          eventsArray = Array.isArray(parsed) ? parsed : [parsed || {
            Type: "getOptions",
            On: "render", 
            Url: "v1/EducationProgram",
            Parameters: ""
          }];
        } catch (e) {
          eventsArray = [{
            Type: "getOptions",
            On: "render",
            Url: "v1/EducationProgram", 
            Parameters: ""
          }];
        }
        
        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'events-main-container';
        
        // Create events list container
        const eventsListContainer = document.createElement('div');
        eventsListContainer.className = 'events-list-container';
        
        // Create add button
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'btn btn-primary btn-sm add-event-btn';
        addButton.textContent = 'Add Event';
        addButton.style.marginBottom = '10px';
        
        // Function to create a single event row
        function createEventRow(eventData: any, index: number): HTMLElement {
          const eventRow = document.createElement('div');
          eventRow.className = 'event-row';
          eventRow.setAttribute('data-index', index.toString());
          
          eventRow.innerHTML = `
            <div class="event-header">
              <span class="event-title">Event ${index + 1}</span>
              <button type="button" class="btn btn-danger btn-xs remove-event-btn">×</button>
            </div>
            <div class="events-form-group">
              <label class="events-label">Type:</label>
              <select class="form-control events-type">
                <option value="getOptions" ${eventData.Type === 'getOptions' ? 'selected' : ''}>getOptions</option>
                <option value="postData" ${eventData.Type === 'postData' ? 'selected' : ''}>postData</option>
                <option value="validate" ${eventData.Type === 'validate' ? 'selected' : ''}>validate</option>
                <option value="transform" ${eventData.Type === 'transform' ? 'selected' : ''}>transform</option>
              </select>
            </div>
            
            <div class="events-form-group">
              <label class="events-label">On:</label>
              <select class="form-control events-on">
                <option value="render" ${eventData.On === 'render' ? 'selected' : ''}>render</option>
                <option value="change" ${eventData.On === 'change' ? 'selected' : ''}>change</option>
                <option value="focus" ${eventData.On === 'focus' ? 'selected' : ''}>focus</option>
                <option value="blur" ${eventData.On === 'blur' ? 'selected' : ''}>blur</option>
                <option value="click" ${eventData.On === 'click' ? 'selected' : ''}>click</option>
              </select>
            </div>
            
            <div class="events-form-group">
              <label class="events-label">URL:</label>
              <input type="text" class="form-control events-url" placeholder="Enter URL" value="${eventData.Url || ''}" />
            </div>
            
            <div class="events-form-group">
              <label class="events-label">Parameters:</label>
              <input type="text" class="form-control events-parameters" placeholder="Enter parameters" value="${eventData.Parameters || ''}" />
            </div>
          `;
          
          return eventRow;
        }
        
        // Function to update the input field with all events
        function updateField() {
          const eventRows = eventsListContainer.querySelectorAll('.event-row');
          const eventsData: any[] = [];
          
          eventRows.forEach((row: Element) => {
            const htmlRow = row as HTMLElement;
            const typeSelect = htmlRow.querySelector('.events-type') as HTMLSelectElement;
            const onSelect = htmlRow.querySelector('.events-on') as HTMLSelectElement;
            const urlInput = htmlRow.querySelector('.events-url') as HTMLInputElement;
            const parametersInput = htmlRow.querySelector('.events-parameters') as HTMLInputElement;
            
            eventsData.push({
              Type: typeSelect?.value || 'getOptions',
              On: onSelect?.value || 'render',
              Url: urlInput?.value || '',
              Parameters: parametersInput?.value || ''
            });
          });
          
          input.value = JSON.stringify(eventsData);
          
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          input.dispatchEvent(event);
        }
        
        // Function to reindex events
        function reindexEvents() {
          const eventRows = eventsListContainer.querySelectorAll('.event-row');
          eventRows.forEach((row: Element, index: number) => {
            const htmlRow = row as HTMLElement;
            htmlRow.setAttribute('data-index', index.toString());
            const title = htmlRow.querySelector('.event-title');
            if (title) {
              title.textContent = `Event ${index + 1}`;
            }
          });
        }
        
        // Add event button click handler
        addButton.addEventListener('click', () => {
          const newEventData = {
            Type: "getOptions",
            On: "render",
            Url: "",
            Parameters: ""
          };
          const currentIndex = eventsListContainer.children.length;
          const newEventRow = createEventRow(newEventData, currentIndex);
          eventsListContainer.appendChild(newEventRow);
          
          // Add event listeners to new row
          addEventListenersToRow(newEventRow);
          updateField();
        });
        
        // Function to add event listeners to a row
        function addEventListenersToRow(row: HTMLElement) {
          const typeSelect = row.querySelector('.events-type') as HTMLSelectElement;
          const onSelect = row.querySelector('.events-on') as HTMLSelectElement;
          const urlInput = row.querySelector('.events-url') as HTMLInputElement;
          const parametersInput = row.querySelector('.events-parameters') as HTMLInputElement;
          const removeBtn = row.querySelector('.remove-event-btn') as HTMLButtonElement;
          
          [typeSelect, onSelect, urlInput, parametersInput].forEach(element => {
            element?.addEventListener('change', updateField);
            element?.addEventListener('input', updateField);
          });
          
          // Remove button handler
          removeBtn?.addEventListener('click', () => {
            row.remove();
            reindexEvents();
            updateField();
          });
        }
        
        // Initialize with existing events
        eventsArray.forEach((eventData, index) => {
          const eventRow = createEventRow(eventData, index);
          eventsListContainer.appendChild(eventRow);
          addEventListenersToRow(eventRow);
        });
        
        // Assemble the main container
        mainContainer.appendChild(addButton);
        mainContainer.appendChild(eventsListContainer);
        
        // Hide original input and show enhanced UI
        input.style.display = 'none';
        input.parentNode?.insertBefore(mainContainer, input.nextSibling);
        
        // Initial update
        updateField();
      });
    }
    
    // Initial enhancement
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceEventsFields);
    } else {
      enhanceEventsFields();
    }
    
    // Observer for dynamically added fields
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          enhanceEventsFields();
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};
