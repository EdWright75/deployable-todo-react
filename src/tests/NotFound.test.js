import { render } from '@testing-library/react';
import NotFound from '../Components/utils/NotFound';

test(`Footer matches snapshot`, () => {
    const view = render(<NotFound />);

    expect(view).toMatchSnapshot();
});