import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Components/Header';

test(`Header matches snapshot`, () => {
  // const headerComponent = render(<Header />);

  // expect(headerComponent).toMatchSnapshot();
  expect(render(<MemoryRouter><Header /></MemoryRouter>)).toMatchSnapshot();
});