function Header() {
  return (
    <div className="container mx-auto px-4">
      <h1 className='font-bold mb-4'>COLUNAS</h1>
      <p className='mb-2'>
        <span className='bg-blue-400 p-1 w-20 inline-block'>PMAX12</span> | mm CHUVAS HOJE
      </p>
      <p className='mb-2'>
        <span className='bg-green-400 p-1 w-20 inline-block'>TMIN18</span> | TEMPERATURA MÍNIMA HOJE
      </p>
      <p className='mb-2'>
        <span className='bg-red-400 p-1 w-20 inline-block'>TMAX18</span> | TEMPERATURA MÁXIMA HOJE
      </p>
    </div>
  );
}

export default Header;