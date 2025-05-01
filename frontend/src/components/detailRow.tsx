import React from 'react';
import {
  Paper,
  Title,
  CopyButton,
  Button,
  Tooltip,
  Group,
  ActionIcon,
} from '@mantine/core';
import { Gene } from '../types/gene';

type Props = {
  gene: Gene;
  onRemove?: () => void;
};

const CopyableCell = ({ value }: { value?: string | number }) => {
  if (!value) return <td>-</td>;

  return (
    <td>
      <Group spacing="xs">
        <span>{value}</span>
        <CopyButton value={String(value)} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow>
              <Button
                onClick={copy}
                variant="subtle"
                size="xs"
                compact
                px={6}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
    </td>
  );
};

const DetailRow: React.FC<Props> = ({ gene, onRemove }) => {
  return (
    <Paper p="md" shadow="xs" withBorder>
      <Group position="apart" mb="sm">
        <Title order={5}>{gene.ensembl}</Title>
        {onRemove && (
            <ActionIcon
              size="sm"
              color="red"
              variant="light"
              onClick={onRemove}
            >
              ✕
            </ActionIcon>
        )}
      </Group>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 600 }}>Ensembl ID</td>
            <CopyableCell value={gene.ensembl} />
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Symbol</td>
            <CopyableCell value={gene.gene_symbol} />
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Name</td>
            <CopyableCell value={gene.name} />
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Biotype</td>
            <CopyableCell value={gene.biotype || '-'} />
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Chromosome</td>
            <CopyableCell value={gene.chromosome}/>
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Start</td>
            <CopyableCell value={gene.start} />
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>End</td>
            <CopyableCell value={gene.end} />
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Length</td>
            <CopyableCell value={gene.gene_length} />
          </tr>
        </tbody>
      </table>
    </Paper>
  );
};

export default DetailRow;