function Card({id, name, img, title, date, place, status, link}) {
    return(
        <>
        <div className="flex flex-wrap w-full p-1">          
                <div key={id}>
                    <div>
                        <img src={`${img}`} alt="" className=" w-full md:h-60 rounded-lg" />
                        <div className="w-full mt-2">
                            <div className="w-full flex justify-between">
                                <a href={`${link}`}>
                                    <p className="font-bold hover:text-blue-500">{`${title}`} </p>
                                </a>
                                <p className=" text-gray-400 text-sm">{`${date}`}</p>
                            </div>
                            <div className="w-full">
                                <p className=" text-gray-700 text-sm">{`${place}`}</p>
                            </div>
                        </div>
                    </div>
                </div>           
        </div>   
        </>
    )
}
export default Card