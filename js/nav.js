function verMenu() {
    document.getElementById("menu").classList.toggle("hidden");
}

function exitLogin() {
    localStorage.removeItem("token");
    window.location.href = "index.html"
}

const token = localStorage.getItem("token");

async function obtenerUser() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch('http://localhost:1337/api/users/me', requestOptions)


        if (!response.ok) {

            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "login.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json()
        showData(data)

    } catch (error) {
        console.log(error)
    }
}

function showData(data) {

    const userName = document.getElementById("userName")
    userName.innerHTML = `${data.username}`
}

obtenerUser()

const navbar = document.getElementById("navbar")
navbar.innerHTML = `<div class="container flex flex-row flex-nowrap items-center text-light justify-between mx-auto">
<!--logo-->
<div class="basis-1/8">
   <a href="home.html"><img src="images/logos/logobueno.png" alt="logo" class="h-16 p-2  max-w-xs transition duration-300 ease-in-out hover:scale-110"></a>
</div>
<!--menu-->
<div class="flex items-center justify-between gap-x-16 hidden lg:block">
    <div id="options" class="flex">
        <a class="text-white hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
            href="home.html">Inicio</a>
        <!--dropdown mi espacio-->
        <div class=" dropdown">
            <button id="dropdownHoverButton" data-dropdown-toggle="dropdownHover"
                data-dropdown-trigger="hover"
                class="text-white hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                type="button"">
                <div class=" flex flex-row items-center gap-x-3">
                <p>Mi espacio</p>
                <svg width='24px' height='24px' viewBox='0 0 24 24' version='1.1'
                    xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                    <title>down_line</title>
                    <g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
                        <g id='Arrow' transform='translate(-288.000000, 0.000000)'>
                            <g id='down_line' transform='translate(288.000000, 0.000000)'>
                                <path
                                    d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z'
                                    id='MingCute' fill-rule='nonzero'></path>
                                <path
                                    d='M12.7071,15.7072 C12.3166,16.0977 11.6834,16.0977 11.2929,15.7072 L5.63604,10.0503 C5.24551,9.65982 5.24551,9.02666 5.63604,8.63613 C6.02656,8.24561 6.65973,8.24561 7.05025,8.63613 L12,13.5859 L16.9497,8.63613 C17.3403,8.24561 17.9734,8.24561 18.364,8.63613 C18.7545,9.02666 18.7545,9.65982 18.364,10.0503 L12.7071,15.7072 Z'
                                    id='路径' fill='#ABABABFF'></path>
                            </g>
                        </g>
                    </g>
                </svg>

            </button>
            <a class="text-white hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                href="filter.html">Géneros
            </a>
        </div>
    </div>
    <div id="dropdownHover"
        class="z-10 hidden bg-zinc-800 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-600">
        <ul class="py-2 text-sm text-gray-200" aria-labelledby="dropdownHoverButton">
            <li>
                <a href="peliculasfavoritas.html"
                    class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Películas que me gustan</a>
            </li>
            <li>
                <a href="peliculaspendientes.html"
                    class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Películas
                    pendientes</a>
            </li>
            <li>
                <a href="peliculasvistas.html"
                    class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Películas
                    vistas</a>
            </li>
        </ul>
    </div>

</div>
<!--barra de búsqueda-->
<div id="search" class="flex items-center w-1/3 sm:w-auto">
    <button id="btn" class="absolute bg-transparent border-0 w-10">
        <i class="fas fa-search text-sm text-white text-2xl px-1 py-1"></i>
    </button>
    <input id="buscar"
        class="searchbar w-full p-2 rounded border-0 shadow form-input pl-16 placeholder-white text-white bg-gray-600"
        placeholder="Busca tu película aquí" type="text">
</div>
<!--menu  hamburguesa-->
<div>
    <button type="button" onclick="verMenu()" class="lg:hidden" id="dropdownHoverButton3"
        data-dropdown-toggle="dropdownHover3" data-dropdown-trigger="hover"
        class="text-white hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
        type="button">
        <svg width='24px' height='24px' viewBox='0 0 24 24' version='1.1' xmlns='http://www.w3.org/2000/svg'
            xmlns:xlink='http://www.w3.org/1999/xlink'>
            <title>menu_fill</title>
            <g id='页面-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
                <g id='Editor' transform='translate(-1248.000000, -48.000000)' fill-rule='nonzero'>
                    <g id='menu_fill' transform='translate(1248.000000, 48.000000)'>
                        <path
                            d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z'
                            id='MingCute' fill-rule='nonzero'></path>
                        <path
                            d='M20,17.5 C20.8284,17.5 21.5,18.1716 21.5,19 C21.5,19.7796706 20.9050879,20.4204457 20.1444558,20.4931332 L20,20.5 L4,20.5 C3.17157,20.5 2.5,19.8284 2.5,19 C2.5,18.2203294 3.09488554,17.5795543 3.85553954,17.5068668 L4,17.5 L20,17.5 Z M20,10.5 C20.8284,10.5 21.5,11.1716 21.5,12 C21.5,12.8284 20.8284,13.5 20,13.5 L4,13.5 C3.17157,13.5 2.5,12.8284 2.5,12 C2.5,11.1716 3.17157,10.5 4,10.5 L20,10.5 Z M20,3.5 C20.8284,3.5 21.5,4.17157 21.5,5 C21.5,5.82843 20.8284,6.5 20,6.5 L4,6.5 C3.17157,6.5 2.5,5.82843 2.5,5 C2.5,4.17157 3.17157,3.5 4,3.5 L20,3.5 Z'
                            id='形状' fill='#FFFFFFFF'></path>
                    </g>
                </g>
            </g>
        </svg>
    </button>
    <!--opciones menu hamburguesa-->
    <nav id="menu" class="hidden flex flex-col gap-4 items-center pt-4 lg:hidden">
        <div id="dropdownHover3"
            class="z-10 hidden bg-zinc-800 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-600">
            <ul class="py-2 text-sm text-gray-200"
                aria-labelledby="dropdownHoverButton3">
                <li>
                    <a class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white"
                        href="">Inicio</a>
                </li>
                <li>
                    <a href=" peliculasfavoritas.html"
                        class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Películas que me gustan</a>
                </li>
                <li>
                    <a href="peliculaspendientes.html"
                        class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Películas
                        pendientes</a>
                </li>
                <li>
                    <a href="peliculasvistas.html"
                        class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Películas
                        vistas</a>
                </li>
                <li>
                    <a class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white"
                        href="filter.html">Géneros
                    </a>
                </li>
                <li>
                    <a href="user.html"
                        class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Ver
                        perfil</a>
                </li>
                <li>
                    <button onclick="exitLogin()" class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600
            hover:text-white w-full text-left">Cerrar
                        sesión
                    </button>
                </li>
            </ul>
        </div>
    </nav>
</div>
<!--perfil de usuario-->
<div id="profile" class="hidden lg:block">
    <button onclick="" id="dropdownHoverButton2" data-dropdown-toggle="dropdownHover2"
        data-dropdown-trigger="hover"
        class="text-white hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
        type="button">
        <div class="flex flex-row items-center gap-x-4">
            <p id="userName"></p>
            <svg width='24px' height='24px' viewBox='0 0 24 24' version='1.1'
                xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
                <title>user_4_fill</title>
                <g id='Icon' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'>
                    <g id='User' transform='translate(-240.000000, -48.000000)'>
                        <g id='user_4_fill' transform='translate(240.000000, 48.000000)'>
                            <path
                                d='M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5935,23.2578 L12.5819,23.2595 L12.5109,23.295 L12.4919,23.2987 L12.4767,23.295 L12.4057,23.2595 C12.3958,23.2564 12.387,23.259 12.3821,23.2649 L12.378,23.2758 L12.3609,23.7031 L12.3659,23.7235 L12.3769,23.7357 L12.4805,23.8097 L12.4953,23.8136 L12.5071,23.8097 L12.6107,23.7357 L12.6233,23.7197 L12.6267,23.7031 L12.6096,23.2758 C12.6076,23.2657 12.601,23.2593 12.5935,23.2578 Z M12.8584,23.1453 L12.8445,23.1473 L12.6598,23.2397 L12.6499,23.2499 L12.6472,23.2611 L12.6651,23.6906 L12.6699,23.7034 L12.6784,23.7105 L12.8793,23.8032 C12.8914,23.8069 12.9022,23.803 12.9078,23.7952 L12.9118,23.7812 L12.8777,23.1665 C12.8753,23.1546 12.8674,23.147 12.8584,23.1453 Z M12.143,23.1473 C12.1332,23.1424 12.1222,23.1453 12.1156,23.1526 L12.1099,23.1665 L12.0758,23.7812 C12.0751,23.7927 12.0828,23.8019 12.0926,23.8046 L12.1083,23.8032 L12.3092,23.7105 L12.3186,23.7024 L12.3225,23.6906 L12.3404,23.2611 L12.3372,23.2485 L12.3278,23.2397 L12.143,23.1473 Z'
                                id='MingCute' fill-rule='nonzero'></path>
                            <path
                                d='M12,2 C6.47715,2 2,6.47715 2,12 C2,17.5228 6.47715,22 12,22 C17.5228,22 22,17.5228 22,12 C22,6.47715 17.5228,2 12,2 Z M8.5,9.5 C8.5,7.567 10.067,6 12,6 C13.933,6 15.5,7.567 15.5,9.5 C15.5,11.433 13.933,13 12,13 C10.067,13 8.5,11.433 8.5,9.5 Z M18.2579,16.9843 C16.7921,18.8222 14.5336,20 12,20 C9.46642,20 7.20792,18.8222 5.74212,16.9843 C7.36304,15.8211 9.57493,15 12,15 C14.4251,15 16.637,15.8211 18.2579,16.9843 Z'
                                id='形状' fill='#B23023FF'></path>
                        </g>
                    </g>
                </g>
            </svg>
            <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                </path>
            </svg>
        </div>
    </button>
    <!-- Dropdown menu -->
    <div id="dropdownHover2"
        class="z-10 hidden bg-zinc-800 divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-600">
        <ul class="py-2 text-sm text-gray-200" aria-labelledby="dropdownHoverButton2">
            <li>
                <a href="user.html"
                    class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white">Ver
                    perfil</a>
            </li>
            <li>
                <button onclick="exitLogin()" class="block px-4 py-2 hover:bg-gray-100 hover:bg-gray-600 hover:text-white w-full text-left">Cerrar
                    sesión
                </button>
            </li>
            <!--meter en js funcion de cerrar sesión con el token-->

        </ul>
    </div>

</div>
</div>`