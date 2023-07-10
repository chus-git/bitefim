import { ReactNode } from "react";
import Loader from "./Loader";

interface LoadableProps {
    children: ReactNode
    loading: boolean,
    failed: boolean,
    backgroundColor?: string
}

export default function Loadable({ children, loading, failed, backgroundColor = "transparent" }: LoadableProps) {

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: "40px" }}>
            <div className={loading ? "center hider" : "center hider hide"} style={{ display: 'block', position: 'absolute', width: '100%', height: '100%', top: 0, bottom: 0, pointerEvents: 'none', padding: '20px', backgroundColor: backgroundColor }}>
                <Loader></Loader>
            </div>
            <div className={failed ? "center hider" : "center hider hide"} style={{ position: 'absolute', width: '100%', height: '100%', top: 0, bottom: 0, pointerEvents: 'none', padding: '20px', color: '#d74242' }}>
                Oops! An error ocurred during the request.
            </div>
            {!loading && !failed ? children : null}
        </div>
    );

}