export default function Modal({open,onClose,children}){
    return(
        <>
            <div onClick={onClose} className={`
              fixed inset-0 flex justify-center items-center
              transition-colors
              ${open ? "visible bg-black/25" : "invisible"}
            `}>
                <div onClick={(e) => e.stopPropagation()}
                className={`
                    bg-gray-700 rounded-xl shadow p-6 transition-all
                    ${open ? "scale-100 opacity-75" : "scale-125 opacity-0"}
                `}>
                {children}
                </div>
            </div>
        </>
    )
}