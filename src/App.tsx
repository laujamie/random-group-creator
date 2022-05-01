import { useCallback, useState } from 'react';
import { Button, Input, Text, Group, Container, Table } from '@mantine/core';
import { Upload } from 'tabler-icons-react';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import type { DropzoneProps } from '@mantine/dropzone';
import Papa from 'papaparse';

function App() {
  const [csvState, setCsvState] = useState<any>(null);
  const [csvError, setCSVError] = useState(false);

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
      {csvState != null && (
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
        </div>
      )}
    </Container>
  );
}

export default App;
