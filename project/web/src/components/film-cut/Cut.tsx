import { Box, Image, LinkBox, LinkOverlay } from '@chakra-ui/react';
import LazyLoad from 'react-lazyload';

interface CutProps {
  src: string;
  handleCutSelect?: () => void;
}

function Cut({ 
  src,
  handleCutSelect, 
}: CutProps): React.ReactElement {
  return (
    <LazyLoad height={200} once>
      <LinkBox as="article">
        <Box>
          <LinkOverlay cursor="pointer" onClick={handleCutSelect}>
            <Image src={src}/>
          </LinkOverlay>
        </Box>
      </LinkBox>
    </LazyLoad>
  );
}

export default Cut;