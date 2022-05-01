import { useCallback, useState } from 'react';
import {
  Button,
  Text,
  Group,
  Container,
  Table,
  TextInput,
} from '@mantine/core';
import { Upload } from 'tabler-icons-react';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import type { DropzoneProps } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import Papa from 'papaparse';

import { shuffleArray, partitionArray } from '@/util/array';

function App() {
  const [csvState, setCsvState] = useState<Array<any>>([]);
  const [csvError, setCSVError] = useState(false);
  const [groupState, setGroupState] = useState<Array<Array<any>>>([]);

  const form = useForm({
    initialValues: {
      numGroups: 0,
    },
    validate: {
      numGroups: (value) => (value > 0 ? null : 'Invalid number of groups'),
    },
  });

  const onDrop = useCallback<DropzoneProps['onDrop']>((files) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    const file = files[0];
    reader.onload = (e) => {
      if (e.target == null) return;
      const contents = e.target.result;
      const parsedCSV = Papa.parse(contents as string, {
        header: true,
        skipEmptyLines: true,
      });
      if (parsedCSV.errors.length > 0) {
        setCSVError(true);
        return;
      }
      setCsvState(parsedCSV.data);
      console.log(parsedCSV.data);
    };
    reader.readAsText(file);
  }, []);

  return (
    <Container className="App">
      <Dropzone
        accept={[MIME_TYPES.csv]}
        onDrop={onDrop}
        onReject={(files) => console.log('rejected files', files)}
        multiple={false}
      >
        {() => (
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: 'none' }}
          >
            <Upload size={80} />
            <div>
              <Text size="xl" inline>
                Drag CSV here or click to select file
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach a CSV of the data you would like to create random groups
                from.
              </Text>
            </div>
          </Group>
        )}
      </Dropzone>
      {csvState.length > 0 && (
        <div>
          <Table>
            <thead>
              <tr>
                {Object.keys(csvState[0]).map((name) => (
                  <th key={name}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvState.map((data: any, i: any) => (
                <tr key={`table-row-${i}`}>
                  {Object.values(data).map((val: any) => (
                    <td key={val}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          <form
            onSubmit={form.onSubmit((values) => {
              setGroupState(
                partitionArray(shuffleArray(csvState), values.numGroups)
              );
            })}
          >
            <Group mt={8} align="flex-end">
              <TextInput
                type="number"
                label="Number of Groups"
                required
                {...form.getInputProps('numGroups')}
              />
              <Button type="submit">Randomize!</Button>
            </Group>
          </form>
        </div>
      )}
      {groupState.length > 0 && (
        <div>
          {groupState.map((group, i) => (
            <Table key={`random-group-${i}`}>
              <thead>
                <tr>
                  {Object.keys(group[0]).map((name) => (
                    <th key={name}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.map((row, j) => (
                  <tr key={`random-group-row-${i}-${j}`}>
                    {Object.values(row).map((val: any) => (
                      <td key={val}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ))}
        </div>
      )}
    </Container>
  );
}

export default App;
