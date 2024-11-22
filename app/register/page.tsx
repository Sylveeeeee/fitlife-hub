export default function RegisterPage () {
    return (
      <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#e2e2e2]">
  <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="flex-1 flex items-center justify-center p-8 bg-[#213A58] text-white w-[500px]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">REGISTER</h1>
        <img aria-hidden="true" alt="illustration" src="/sp.png" />
      </div>
    </div>
    <div className="flex-1 p-8">
      <h2 className="text-xl font-semibold mb-6 text-black">REGISTER</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
          <input type="text" id="username" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2" placeholder="Enter your username" required />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Email</label>
          <input type="email" id="Email" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2" placeholder="Enter your Email" required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
          <input type="password" id="password" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2" placeholder="Enter your password" required />
        </div>
        
        <div className="flex items-center mb-4">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-sm text-black">ACCEPT</label>
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground bg-black text-white hover:bg-transparent hover:text-black border-solid border-2 border-black  p-2 rounded-md">REGISTER</button>
      </form>
    
    </div>
  </div>
</div>        
      
      </>
  
     
      
    );
  }