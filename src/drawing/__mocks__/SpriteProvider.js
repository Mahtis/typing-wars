const spriteProvider = jest.genMockFromModule('./SpriteProvider.js');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
// let mockFiles = Object.create(null);
// function __setMockFiles(newMockFiles) {
//   mockFiles = Object.create(null);
//   for (const file in newMockFiles) {
//     const dir = path.dirname(file);

//     if (!mockFiles[dir]) {
//       mockFiles[dir] = [];
//     }
//     mockFiles[dir].push(path.basename(file));
//   }
// }

// A custom version of `init` that reads from the special mocked out
// file list set via __setMockFiles
const init = () => {
  return mockFiles[directoryPath] || [];
}

const getSprite = sprite => {
  return document.createElement('canvas');
}

// fs.__setMockFiles = __setMockFiles;
spriteProvider.init = init;
spriteProvider.getSprite = getSprite;

export default spriteProvider;