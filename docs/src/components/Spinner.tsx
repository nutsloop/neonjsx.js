import { css } from '@nutsloop/neonjsx';

interface SpinnerProps {
  message?: string;
}

export const Spinner = ( props: SpinnerProps ) => {
  css( './spinner.css' );

  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      { props.message && <p className="spinner-message">{ props.message }</p> }
    </div>
  );
};
