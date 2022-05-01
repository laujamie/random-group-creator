import { useCallback } from 'react';
import { Button, Input, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import type { DropzoneProps } from '@mantine/dropzone';

function App() {
  const onDrop = useCallback<DropzoneProps['onDrop']>((files) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    const file = files[0];
    reader.onload = (e) => {
      if (e.target == null) return;
      const contents = e.target.result;
      console.log(contents);
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="App">
      <Dropzone
        accept={[MIME_TYPES.csv]}
        onDrop={onDrop}
        onReject={(files) => console.log('rejected files', files)}
        multiple={false}
      >
        {() => (
          <Text size="xl" inline>
            Drag CSV here or click to select file
          </Text>
        )}
      </Dropzone>
    </div>
  );
}

export default App;
