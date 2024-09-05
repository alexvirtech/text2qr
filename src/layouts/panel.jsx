export default function Panel({child1,child2,created}) {
    return (
        <>
            {created ?  
                <div class="w-full max-w-[1000px] mx-auto px-8 py-8 tablet:flex tablet:justify-start tablet:gap-2">
                    <div class="w-full tablet:w-[50%] border border-gray-300 p-1 mt-1">{child1}</div>
                    <div class="w-full tablet:w-[50%] border border-gray-300 p-1 mt-1">{child2}</div>
                </div> :            
                <div class="w-full max-w-[1000px] mx-auto px-8 py-8">
                    <div class="w-full border border-gray-300 p-1 mt-1">{child1}</div>
                    <div class="w-full border border-gray-300 p-1 mt-1">{child2}</div>
                </div>
            }
        </>
    )
}   