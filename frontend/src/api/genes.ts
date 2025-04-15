import axios from 'axios';
import { Gene } from '../components/GeneTable';

const API_BASE = 'http://localhost:8000';

export const fetchGenes = async (): Promise<Gene[]> => {
  const response = await axios.get(`${API_BASE}/genes?limit=10`);
  return response.data;
};
