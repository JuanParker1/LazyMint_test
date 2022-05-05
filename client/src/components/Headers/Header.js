import React from "react";
import ConnectButton from "./ConnectButton";

export default function Header() {
  return (
        <>
            {/* Header */}
            <div className="row">
                
                <div className="col-12">
                    <div className="float-right">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </>
    );
}
