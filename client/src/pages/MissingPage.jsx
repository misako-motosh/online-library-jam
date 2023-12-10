import '../index.css';

const MissingPage = () => {
  return (
    <div className='container square-box d-flex justify-content-center align-items-center flex-column'>
      <h1 className='text-center text-bg-secondary p-3'>ERROR 404</h1>
      <h2 className='text-center'>Page not found</h2>
      <p className='text-center'>The resource requested could not be found on this server!</p>
    </div>
      
   
    
  );
}
export default MissingPage;