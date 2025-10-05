import { IReportsData } from "@/types/reports.type";

export const getReportsAsync = async (): Promise<IReportsData> => {
  try {
    const response = await fetch('/data/reports-v001.json');

    if (!response.ok) 
    {
      throw new Error('Failed to load reports data.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error: ', error);

    return { 
        reports: [], 
        metadata: {
            version: "0.0",
            last_update: "",
            total_data_count: 0,
            type: ""
        }
    };
  }
};
