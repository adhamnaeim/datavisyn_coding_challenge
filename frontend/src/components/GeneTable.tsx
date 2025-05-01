import React, { useState, useEffect } from 'react';
import {
  Table,
  ScrollArea,
  Drawer,
  Button,
  Group,
  ActionIcon,
  Title,
} from '@mantine/core';
import { Gene } from '../types/gene';
import DetailRow from './detailRow';
import { exportGenesToCSV } from '../utils/export';
import ExportWarningPopover from './ExportWarningPopover';
import GeneCharts from './GeneCharts';

type Props = {
  genes: Gene[];
  allGenes: Gene[]; 
  sort?: string;
  order?: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  search?: string;
  filterSearch: boolean;
};

const highlight = (text: string, term?: string) => {
  if (!term || !text.toLowerCase().includes(term.toLowerCase())) return text;
  const regex = new RegExp(`(${term})`, 'ig');
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(regex, '<mark>$1</mark>'),
      }}
    />
  );
};

const GeneTable: React.FC<Props> = ({
  genes,
  allGenes,
  sort,
  order,
  onSortChange,
  search,
  filterSearch,
}) => {
  const [opened, setOpened] = useState(false);
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
  const [selectedGenes, setSelectedGenes] = useState<Gene[]>([]);
  const [selectedDrawerOpen, setSelectedDrawerOpen] = useState(false);
  const [selectedChartsOpen, setSelectedChartsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedGenes');
    if (saved) {
      setSelectedGenes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedGenes', JSON.stringify(selectedGenes));
  }, [selectedGenes]);


  useEffect(() => {
    if (selectedGenes.length === 0) {
      setSelectedDrawerOpen(false);
    }
  }, [selectedGenes]);

  const handleRowClick = (gene: Gene) => {
    setSelectedGene(gene);
    setOpened(true);
  };

  const toggleSelect = (gene: Gene) => {
    setSelectedGenes((prev) => {
      const exists = prev.some((g) => g.ensembl === gene.ensembl);
      return exists ? prev.filter((g) => g.ensembl !== gene.ensembl) : [...prev, gene];
    });
  };

  const removeOne = (ensembl: string) => {
    setSelectedGenes((prev) => prev.filter((g) => g.ensembl !== ensembl));
  };

  const isSelected = (gene: Gene) =>
    selectedGenes.some((g) => g.ensembl === gene.ensembl);

  const renderHeader = (label: string, field: string) => {
    const isSorted = sort === field;
    const arrow = isSorted ? (order === 'asc' ? ' ▲' : ' ▼') : '';
    return (
      <th onClick={() => onSortChange(field)} style={{ cursor: 'pointer' }}>
        {label}
        {arrow}
      </th>
    );
  };

  const rows = genes.map((gene) => {
    const match =
      search &&
      !filterSearch &&
      Object.values(gene).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(search.toLowerCase())
      );

    return (
      <tr
        key={gene.ensembl}
        onClick={() => handleRowClick(gene)}
        style={{ cursor: 'pointer' }}
        className={match ? 'highlight-row' : ''}
      >
        <td>
            <ActionIcon
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                toggleSelect(gene);
              }}
              variant={isSelected(gene) ? 'filled' : 'outline'}
              color={isSelected(gene) ? 'green' : 'gray'}
              size="sm"
            >
              {isSelected(gene) ? '✓' : '+'}
            </ActionIcon>
        </td>
        <td>{highlight(gene.ensembl, search)}</td>
        <td>{gene.gene_symbol ? highlight(gene.gene_symbol, search) : '-'}</td>
        <td>{gene.name ? highlight(gene.name, search) : '-'}</td>
        <td>{gene.biotype || '-'}</td>
        <td>{gene.chromosome}</td>
        <td>{gene.start}</td>
        <td>{gene.end}</td>
        <td>{gene.gene_length}</td>
      </tr>
    );
  });

  return (
    <>
      <Group position="apart" mb="xs">
        <Button
          size="xs"
          variant="light"
          onClick={() => exportGenesToCSV(genes, 'filtered_genes')}
          >
          Export Page
        </Button>
        <Group>
          <ExportWarningPopover onConfirm={() => exportGenesToCSV(allGenes, 'full_filtered_genes')} />
        </Group>

      </Group>

      <ScrollArea>
        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
            <th style={{ cursor: 'pointer' }} onClick={() => {
                const allSelected = genes.every((g) => selectedGenes.some((s) => s.ensembl === g.ensembl));
                setSelectedGenes((prev) =>
                  allSelected
                    ? prev.filter((g) => !genes.some((current) => current.ensembl === g.ensembl))
                    : [...prev, ...genes.filter((g) => !prev.some((s) => s.ensembl === g.ensembl))]
                );
              }}>
                {genes.every((g) => selectedGenes.some((s) => s.ensembl === g.ensembl)) ? '☑' : '☐'}
              </th>
              {renderHeader('Ensembl', 'ensembl')}
              {renderHeader('Symbol', 'gene_symbol')}
              {renderHeader('Name', 'name')}
              {renderHeader('Biotype', 'biotype')}
              {renderHeader('Chromosome', 'chromosome')}
              {renderHeader('Start', 'start')}
              {renderHeader('End', 'end')}
              {renderHeader('Gene Length', 'gene_length')}
            </tr>
          </thead>
          <tbody>
            {genes.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '1rem', color: 'red' }}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Gene Details"
        padding="md"
        size="xl"
        position="right"
      >
        {selectedGene && <DetailRow gene={selectedGene} />}
      </Drawer>

      <Drawer
        opened={selectedDrawerOpen}
        onClose={() => setSelectedDrawerOpen(false)}
        title={
          <Group position="apart">
            <Title order={4}>Selected Genes ({selectedGenes.length})</Title>
            <Group spacing="xs">
              <Button
                size="xs"
                color="red"
                onClick={() => {
                  setSelectedGenes([]);
                  setSelectedDrawerOpen(false);
                }}
              >
                Clear All
              </Button>
              <Button
                size="xs"
                variant="light"
                disabled={selectedGenes.length === 0}
                onClick={() => exportGenesToCSV(selectedGenes, 'selected_genes')}
              >
                Export Selected
              </Button>
              <Button
                size="xs"
                onClick={() => setSelectedChartsOpen((prev) => !prev)}
                variant="outline"
              >
                {selectedChartsOpen ? 'Hide Charts' : 'Show Charts'}
              </Button>
            </Group>
          </Group>
        }
        padding="md"
        size="xl"
        position="right"
      >
        {selectedChartsOpen && (
          <div style={{ marginBottom: '1rem' }}>
            <GeneCharts genes={selectedGenes} filters={{}} useFullDataForCharts={false} />
          </div>
        )}

        {selectedGenes.map((g) => (
          <div
            key={g.ensembl}
            style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}
          >
            <DetailRow gene={g} onRemove={() => removeOne(g.ensembl)} />
          </div>
        ))}
      </Drawer>

      {selectedGenes.length > 0 && !selectedDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 1000,
            transition: 'right 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '0.5rem 0',
              backgroundColor: '#1c7ed6',
              color: 'white',
              borderTopLeftRadius: '9999px',
              borderBottomLeftRadius: '9999px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontWeight: 600,
              fontSize: '0.85rem',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              transform: 'translateX(0)',
            }}
            onClick={() => setSelectedDrawerOpen(true)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateX(-10px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
            }}
          >
            Selected<br />({selectedGenes.length})
          </div>
        </div>
      )}
    </>
  );
};

export default GeneTable;