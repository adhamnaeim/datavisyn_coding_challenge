import React, { useState } from 'react';
import { Button, Popover, Text } from '@mantine/core';

type Props = {
  onConfirm: () => void;
};

const ExportWarningPopover: React.FC<Props> = ({ onConfirm }) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom" width={260} withArrow shadow="md">
      <Popover.Target>
        <Button size="xs" color="blue" variant="outline" onClick={() => setOpened(true)}>
          Export Full CSV
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm" mb="xs">
          This will export the entire dataset (with current filters), which may be large.
        </Text>
        <Button
          size="xs"
          color="green"
          fullWidth
          mb="xs"
          onClick={() => {
            setOpened(false);
            onConfirm();
          }}
        >
          Proceed
        </Button>
        <Button size="xs" variant="subtle" color="red" fullWidth onClick={() => setOpened(false)}>
          Cancel
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ExportWarningPopover;