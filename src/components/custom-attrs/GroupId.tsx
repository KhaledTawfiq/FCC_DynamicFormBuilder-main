import { getEnums } from '@/services/apiService';
import React, { useEffect, useState } from 'react';

interface EnumItem {
  id: number;
  name: string;
}

const GroupIdComponent: React.FC = () => {
  const [data, setData] = useState<EnumItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEnum, setSelectedEnum] = useState<string>('');

  useEffect(() => {
    getEnums()
      .then(response => {
        setData(response);
        console.log("Enums loaded:", response);
      })
      .catch(error => {
        console.error("Error loading enums:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedEnum(selectedId);
    
    
    if (selectedId) {
      const selectedItem = data.find(item => item.id.toString() === selectedId);
      if (selectedItem) {
        console.log("Selected enum:", { name: selectedItem.name, id: selectedItem.id });
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Select Enum:</h2>
      <select value={selectedEnum} onChange={handleSelectChange}>
        <option value="">-- Select an option --</option>
        {data.map((item) => (
          <option key={item.id} value={item.id.toString()}>
            {item.name}
          </option>
        ))}
      </select>

      {selectedEnum && (
        <div style={{ marginTop: '10px' }}>
          <p>Selected: {data.find(item => item.id.toString() === selectedEnum)?.name}</p>
        </div>
      )}
    </div>
  );
};

export default GroupIdComponent;