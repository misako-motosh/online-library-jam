import '../index.css';

const UnauthorizePage = () => {
  return (
    <div className='container square-box d-flex justify-content-center align-items-center flex-column'>
    <h1 className="text-bg-danger p-3">Unauthorized: Access is denied due to invalid credentials.</h1>
    <h4>You do not have permission to view this directory or page using the credentials that you supplied.</h4>
    </div>
  )
}

export default UnauthorizePage