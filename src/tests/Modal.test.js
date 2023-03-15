import { render } from '@testing-library/react';
import Modal from "../Components/utils/Modal";

describe('modal display class tests', () => {

    test('should have classnames modal, display-block if message exists', () => {
        const { container } = render(<Modal message="test displayed" handleClose={() => { }} />);
        expect(container.firstChild).toHaveClass(`display-block`);
    });

    test('should have classnames modal, display-none if message does not exist', () => {
        const { container } = render(<Modal message="" handleClose={() => { }} />);
        expect(container.firstChild).toHaveClass(`display-none`);
    });
});