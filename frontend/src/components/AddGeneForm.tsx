import React, { useState } from 'react';
import {
  TextInput,
  NumberInput,
  Button,
  Paper,
  Group,
  Stack,
  Notification,
} from '@mantine/core';
import { Gene } from '../types/gene';

const initialForm: Omit<Gene, 'gene_length'> = {
  ensembl: '',
  gene_symbol: '',
  name: '',
  biotype: '',
  chromosome: '',
  start: 0,
  end: 0,
};

type Props = {
  onGenesAdded?: () => void;
  onSuccess: () => void;
  onRefreshFilters?: () => void;
};

const AddGeneForm: React.FC<Props> = ({ onGenesAdded, onSuccess, onRefreshFilters }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
  
    if (!form.ensembl || !form.chromosome || !form.start || !form.end) {
      return setError('Missing required fields.');
    }
    if (form.start >= form.end) {
      return setError('Start must be less than End.');
    }
  
    // Clean and normalize fields
    const cleanedGene: Gene = {
      ensembl: form.ensembl.trim(),
      gene_symbol: form.gene_symbol?.trim() || '',
      name: form.name?.trim() || '',
      biotype: (form.biotype ?? '').replace(/\s+/g, '').trim().charAt(0).toUpperCase() + (form.biotype ?? '').replace(/\s+/g, '').trim().slice(1),
      chromosome: form.chromosome.trim().toUpperCase(),
      start: form.start,
      end: form.end,
      gene_length: form.end - form.start,
    };
  
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/genes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([cleanedGene]),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add gene');
  
      setSuccess(true);
      setForm(initialForm);
      onGenesAdded?.();
      if (typeof onSuccess === 'function') onSuccess();
      if (typeof onRefreshFilters === 'function') onRefreshFilters();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder radius="md" p="md">
      <Stack>
        <Group grow>
          <TextInput
            label="Ensembl ID*"
            value={form.ensembl}
            onChange={(e) => handleChange('ensembl', e.currentTarget.value)}
          />
          <TextInput
            label="Gene Symbol"
            value={form.gene_symbol}
            onChange={(e) => handleChange('gene_symbol', e.currentTarget.value)}
          />
          <TextInput
            label="Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.currentTarget.value)}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Biotype"
            value={form.biotype}
            onChange={(e) => handleChange('biotype', e.currentTarget.value)}
          />
          <TextInput
            label="Chromosome*"
            value={form.chromosome}
            onChange={(e) => handleChange('chromosome', e.currentTarget.value)}
          />
          <NumberInput
            label="Start*"
            value={form.start}
            onChange={(val) => handleChange('start', val || 0)}
          />
          <NumberInput
            label="End*"
            value={form.end}
            onChange={(val) => handleChange('end', val || 0)}
          />
        </Group>

        <Group position="right">
          <Button onClick={handleSubmit} loading={loading} size="sm">
            Add Gene
          </Button>
        </Group>

        {error && (
          <Notification color="red" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        {success && (
          <Notification color="green" onClose={() => setSuccess(false)}>
            Gene added successfully!
          </Notification>
        )}
      </Stack>
    </Paper>
  );
};

export default AddGeneForm;
