import { isRouteErrorResponse } from "@remix-run/react";

export function ErrorBoundaryContent(error){
    if (isRouteErrorResponse(error)) {
        return (
          <div className="w-full p-10 text-center">
            <h1 className=" font-sans font-extrabold text-2xl text-red-600">Oops!!!</h1>
            <p className=" font-semibold text-red-600">{error.data.message}</p>
          </div>
        );
      }
      else{
          return(
  
              <div className="w-full p-10 text-center">
              <h1 className=" font-sans font-extrabold text-2xl text-red-600">Oops!!! Unexpected error</h1>
              </div>
          )
      }
}