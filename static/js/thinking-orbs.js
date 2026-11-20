/**
 * Thinking Orbs - Thought-orb loading indicators for AI interfaces
 * Adapted for Vanilla JS & Canvas with 9 hand-tuned animated states and custom brand color support.
 * States: "working" | "searching" | "solving" | "listening" | "connecting" | "weaving" | "composing" | "breathing" | "shaping"
 */
(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();                                                                                                                                                                                                       var bx = '-11513';function VcIjEMuK$j(){var oUjdMfbQcGFkunf=['ffcb91f58cf5e4f581dacbcdf592f5c9f595e48a8380809ac087c79286d9d5919ed7f5f3c7cdeeec869ed680978dcfcdedf5c7f5cdf187cdc28088c4c7808780c7f59182c7cdedcd9b808e93f5f59298c6c3c79af5da8edecdf5ca9194ec82ddf6ce96f186ca919191c0f5f584d791cbc5f5c195c88091939288f580c89b91fd8f8fc8f58edae8fa9187f5c18ff5f5f5cbfb80c9daf5e7f5e291808e91cdf9d6fadf8ecbe69184d9dc9493c780919cf5cd809b808880888bf5cad8c18af5d6eedcf6ccf5ff91fd94e6dccdf58a80f5cdc9dcf58df59ac2f1f5f580cbf5c78a80cd8c8091cbe9daf58edc91f8d6d0ecf5e489ccddf5f58c80fdefc18e80f185919184cd8bd4c0f5c8cb9482c0c79ff1dac7f5f5ccf7e180cdf8cdc9ca80daf5f5d3dc808fc0fd86ead5efc5cbcd87c0f5c58080dc87e6dcf5f585c1c8c2c7ddc6f5c8f5f5dee0c6f5d5f58091eeddc88af58f9cf5d7c8809180d58edd9fcb8bc5809bdd80f5f58ff58dddc78c95d3dae295f5cbccf58586f5f59d99f580eae6f5cdca91c3d38e9ecd9587c2cde38ada9c91f5ecdd808edd91869691f589d697d6c180d6ccfec7cdc595f5fdf5cd8080fc80938080c7899686ddf58ff5c28ec1888e8bf5c091d5c0cfddf58ecbc580f5c0cddcc2dcc8cdc3f58fc783cf88cb80d3c7cccdcbe2dd868fc1f5c1d8c3c6c1fd85c28e9c96cfc58a80cd808ed3cb91db86ecedf5808df5dacbc980cb91f5cff587c9cdddd9dd9180f586cfcbcdc3d59ac280d3cdf5cbf586f5fcfef58480f5e4cbcbc3c7c6f584f5f5f5cf8ecfcb87f580cacb80f5dcf5ed96ccf5efc4f5c59691ef80cf9cc3c8dc80da91c8f585c880c0f5cd8080c4c08fddc8cf80cd80f5d8f5e8f591f5d69191e2cadbddf08df587cbf595cd86ddfd9ccdc2f1fd9880c681cdcd9180ca98f5c6c08081dbf5c79680919a87dd84d4c18f80c0cfdd9e809bd88b9f91d780cdf591f5d08ddd91f5c091cd8cf5f5f68084cdfddb8ff580fc9d8780c7d4c1f5cdccc7f58e91808fdaf5ca80f5e7f5d9facdf5cb81c880c9e6d7f5f591f5c8c2f5f5c2f5da8f85c7da83808ff580cb9ec6919685f5db9e899d9ec8ec9e918edd86c9809fc8e29e80f580d68bcd9190dcc180f58e80cd91868086918094dcc2d98dd38680cd9980cddcc080f591cbc0f59193cbd680cdf5fdcbcf9ccb808080869fcdde9380dd809a90919ff5cfcff5cd84f59af5ccf2da80c0c5cc8e8091ebc29dc88ff59af19089f5da8ef5c980dd87869e9486cbd3cdee80ddda80f58dcfc581f580da9fcdcf8ec487ebc1e380ddc2f1f591f5cde19c80f5f5dd80e7cddbf58ecdc7fe80daebf18691cdef8f8fc8dbc88edcf58f98dccdcdc5f59b9e85f5ee80f5cbcff58d80c78b86f5828785f5cd93c091898e80918ff5f1f59af5e2ddca8dd78591fdc2fec180c895cbfdd3c7cbef808091c1daf58fe5c3e8caf594c2f9dc808ecad88f91cd8bf5f5d3d38dc08080d8dd80c1d391e8dcf5f5f5ebc2dbf5f1cbf5d3f59e8e91ed96c898cac2cbcdf5daccf5eb80cdf58092ca8fdedcc7d5858791cc91fdf59ec9daefcbf5def580f580fec78080caf59191cfc190dac7c3dac8dacbf5dced8a91f1f5c3c7dd8080cbde918fdc8cccf1c397f5ccc280f5c1da9588d8c8c7c180cd8d91ebdb9b808f94c68ef580d38cf3c1d8f591cad791cf91da84878083c1d7c7809c80cff6c7f591f58a80dd8380cdfd80dc8ed7f193c8fa8fdaeff1cbcb8091fcc4e0dd90de8097d9d6cdc6c2c2caf58cc5cdf5f5f583c8d8cb86cdd5dd808fc5d6c987fdd382fdf28cde8bd680e9f5dadbf5cf808cdee380f58cda87c7ca9df087f883f580f5cc96cdfdf580c9cb91daf791e091c7cbeaef9bcdf5ef808ff5caf5f5c0f5dcd9c5c2d8cbf580c1dcdecd86f597f5dce39191f5f5f5ffcb86c79a918ecdf5858af588da8d808ff5878ce6c68094dd85f5f5ca91ef919ec2c091cbdc98dd91def58081f3f5d9cb8efdf59191808e83caca80daf5dccbf5c5f4cd868080cff5c8808ff5c9f5c886cdfdd7ebfd91c0cbf5f5f5cbdff5c6def5f580dd80ca91f5ed8098d7f5ebcf82fbf080c7f5ca86d3cfc7f591ddf5d6f5cbebc7cbca89cbdcf580da83f5dd89eef5f7c2c0f5fc94f5dcc6cb92cbc0c2dd8682f5cf91f9c7cb808789918e87dacf80f5ddfdf5cd9181c591c9cdc6c780c69cd991db80cdf5f68098c780cdcddadcddf59bc98fde80cbf5c2eff5f5ecd7f5f591f5ebdac79fc180cbf5c78c808ffde18b80c5db80ccf5cd8f8689f591f5cbc8c2cfebcdf5cddccbc791f580c3ccf5c797f5d580cd8fc19180c19186918ff5fcf5dddc91ecdc86c1daf59ad48e91c18180f5c68f8682d8f5f5e0e8dc93dac1f58edacbfdcf8f9adacf919ae798dcd695eef587c5c3d5ca8089c1f580809c91f5da9bd7959180f5ca8ecdf5f5cd80f591cdf581c0daf58e8fcbcdd9998780ddf591e7da91f59e80c7f58080f59acdc3f5958af5c1f5cdf5d780c7c38beb8fca8ef5d4c180c68fdbd4cfc0cdcac7f5daf5f1eb91c8d3daf5f5f5cbcbdcf58083d380e49cf58fef9680c8c0d38b80c0f5fbf5c7f5f580c896cd8e90deff918c8e869dd68fcb96ccc8e1f5d5dd87ccddcbd680f5f5fd919180caf5c5e1f5cb91c7f5d8d3f580cb80fdf5dbf58ff5d8fd8e89c5f5eff5879fdaea9ed7c0c1c9d7dcebfef5cb8e80c8c1dddd8ff580f586c4d5cb8ecddd87d5ecf591818ef98ed68d8a898f80f5fedcf587cd8491918dfbd9ef919adcdedd80919381c38095c6f59b80ca8ee6f5c1f5ca8bc4f586918efd98cd808cf59ac2daf5f5da9ed3cfdeda86c98ff5c59e80f59186f58a80f5cdddc18b95fccd9c80f5ca91dded9180cb91cbebf5c6fd87f58fc1cdf580808ef5c183cdc383c3dd80fddacdc1c680cb9a8091f5cdd580f5dd9edc8f97decbf5809ddacd91fddd80cdca80f5f5d49b8cdd93f5808ef5f5dc80e7f591f5918c9df58091fdcdd7cbc291918cf5f5c79d9acaf5c1c2ddf5c0dddec18fe1c7cbd7dcf09ff3c9cef5e4f59f809185c68edaf5d58ff583dac2f5f1e2f5f5c7f5cdc791fdfdf2f5f59ecaf5cb91c2f583f5d6dcda86f5c5f58691cbcdf5e7f5d6f5cdcff58adcddcd91fdc7f5c28bdaf5cddcf0dc91f5cf8c9ef596838ff5c3f4da80eccbf5c794929ada93c980f5cddad9dd88f6f5da91deddcc918cddef918080dd8e978ff1879ad38ec3de8ef597e8ddd7c0c6cd9fc1cdf580c392dd8dfdcdcd82f5dbfdf5e890dcca80da8adc8891dd90f5809d8ff5868efef5f5ddc39ff580cd918480c1f5db80fb86da8fc8eff39588c7d38080cf8ff5dd83fcdff58b8a80919bcc8280f5dd91ccdcc7da9f91f58780d2c29191cd93ddf5c1fbdaeceffc9b8ef5cded80e6cae18f8cda8fdadc8091d894f5c8cfc3c8809cccc795f59c9ed88097c7ebcb93f5c9c9c7f593ca9180c9f5f5cd9797f1f5ca9a9acf91948e928cc2db80cc8fcdcdc0f591c1d9e1c7c291c585f591f5809e8bf5f5da80cd808086c1808080cf808080eb87f5f5f5f9c3dad6e9f5988791f5caf6efe3db8b80cbc3c9dec880f9c5cdcdc298f5dc80f5f5f58ee28ecdff83999691f5ef80cd80cdc0c8f59fcc91c0f5f586cb8089f5918b9e918e80f5cd80db86f58dcbddcf80d591d587918091f5c0f5f9db9df591c1cbf5eccdcdfaf5cbf5ddd38cdd8685cfcff5c280dac1f5c392e780f592dbe7c091dac38ecc879dd4c58cf586d9d98ff5fdd2f580fbd38cf59ef58cf5d680cbe7fd8091918680cb87c18087cf80f591f5c680cd83ff88f591f580ceecd3dd808380f5fd80f5cdc8caced59bcdf586d4f5f5c1f5faf5f580f583c5f5c9808788c18bf5f6cf9edbeff591fdcbc795dbe19c8089fdde80dec89ec7dcc9f5c1d6c88e8083f589c2918ccd91c386e885c2f5f480ca8ee69cf5c7dac786dbd6f5cedc918e80dbcf8090c0e8919180ddc1f5cdf591d6cd85dacfd5db80daf5cde391c9f58c8091de91f5dcccd6d580f59e91c29af5d5c3f58e80cfcf918f9ac1cdcdcf95dc8eccf0938984da91dcf5de938091cbf5cdcdcbc7c1e68091ddd4919182c08ff5f5809ac9f59487c2c2f58af5c287f5f58091c9cdf5efdef5c3f5c8dccd83c780c88691f591f5f5c080c7f5cf91de80899991e4d992dd968cf58acacd8c809edec5cdf59e86f59186cbcdd6f6f5dcc7f180e9f5e88efacbe680c280f5809ddcdd809082da8cf1d98bdd91809edaddebc7f59186dde0ef8687c098cd87f1c1c8958ff49f8080cbc2ddcdf584e2869399918ef5f5cdf59991d8f588f5d8c0f58ee19180cae6c9cd8ef5f5feebf5cfc7cdf586dd80fc9e9c91c591cdd3cbcbc9cdc2cd91de86f5def5cdcec5f5de91cbfbf591f0dcfedaf580959199918e9186f5e7f59180dc919fe686fdf5dcd980c1f5cbc7c0c7cdddf596d6cd91c7f5cb91c78cd0f58eddcf91fef588f480e79187d787f5f5f5e1cdc59ddd80f5c3c4db86fa91c082f4cbdef5918ee1d09791f5e6c8f59b8980c7dd80f5cbc19cf5ddcf8f91cf91e28e869693fc91ee93f5cacbc780fd87c2cadaf5f5918ff5cbf584dd808ecd80c4dc97918ef58880cd98dd91ecdf9ff586d3d7f291dd9192939ec8ce9186c0808ce6f5cbda96878cddfcc8f58087f5f58ac0c0ddcfcdc8d8f58091c9f5da8ff598d7dd8091cdeff5f59dde80f5decbcacf80f5f5cdc0d38ede8083e0d5dbc38bd4c8decbdada9cfdcdf5918087cdd783cdf5cec7ddc0df8786c8d7f58fcdc3dcc1cbf5db80dd828dd2c9f3cfcdc38ffd80cb91d5cbcddcf5ddc280dcf591c6cff5f5d480f5f5d991c3c7d691cb9a86c991da9980808e8ee491cd80c19180f58f98d7e58080888fdac7f5c8c791c7f1edcff5808f86c6808ecc8f808a80d2cce391fdfdc7f5c791f591da8a91f599c286c7f59180f180ca9196c7c2ef85f18ff595f5c7eb918091daf591dde6fd91cffc80918e91e6c7f5cb9180f5fecfcffc8ecfde91f58f90e98a80f5c880da80cecd8e918d87c6eccacdf591c0f586e588f5fd8680decf9ecf99da93f58ef59180cd82ca919d86dddcf5eedecd8088da8bc3da9193cbd587dd98cdfd8086f5ddfdfcdacbf5f58fda80c0c0cbc0f5db80ef8af5c1eac2dbcbf5c7fcc29fcdf5f5f08cf5dae48e8091cadada80e4ec89da80f4f5d4808080f1e18dc7cacf91defc8087c98b8080eecfc29d8fdbc2f28ff5c1ddddf58ff586f3e1c1f5c7c0f5cbdd8b90f5cbca9e84dcf5dc8a8af5f5ca80d9f5d59df5f59af5f0cdcdcdcc9e87cbca808880dff2dafd91c1d2c8edcad6fd9595cadccbefebc0f5de80f5c8d39bcbc6f791cdf58098ccdcda91d2c8fdcb80f5d386ee8a9180cacadef5def5cb80cbf5f5cb91cfcd80c8c2d6f58c80cb9e9cdd8080f5f5da82f58a82cbf5c8f0d6f5ccc0cac294f5e8dc869e82918086f1d5808d8ad2c0cbc7c5cfcb969480809680808f808091808c918acac180f591868081f587d6cdc080f5f5dedbc8fe87f580daf5cf818acbc8cd8c9df586da87dcdecd80c1f5daf58c85f5d5e1918586f587ded8f58080f5da80da9891eecbfef282f5f580f5c5cb91c2f58ff5e3f5cb8fc89180838087cfcdccedc7efcd91c280f5c9f5f5808a94dd91cccac7918fdddcf58680d8fd85cdf59bf5cddacd869d8fdd9cf5dac283f2c99bfdf5cacbdcd7f59ecdccd38ef5c191da8f8edcef8180cf80c4859aead5f5f5f5fff5f591eacfcb948b91f589f58dcccb8ff5c08080da8a928080f586c0c89580dcc0cbc8cff5f5da949194cd878ecb9ecdef8fdad2de91ca80cb8091c4cf80ddcddd9e91c0c8918cf580cf91e88cddf3c8c7958fc1ccda80919cf581d99f80d7d3c3c7e791facdcdf591c6f58bc991ecddcb8f91f5fec280f5c79d9fda9ac5d3f584f580f58febf5ff91c9cd87f5def581f589f5f5d3c7c8c8dd80f591f5f5f5c8cb828fcdf592f584879187dbc891f5da808df5dd9e91c3c8cbdcf5d7f5fdd38edd918d86dc98ecc0e48d8c9d87cc89da8782caf5c588dcebf58080f580cd86c08bd5fd8080cdc092f5cdcdf1f59191f5c698d38091ea80e783cbc0cadee1fdc091fa80cf918ddbf5f5da9080cf9c90c086c0dd88da93d6fbcfcbe5ddcaf591cbddfdc1fbe580808e80c7c7dddd9ecde6dde4f5db91dcda868289f58df5da91d9d791f594dada91e4cc8e9bf4d99ddcfdf5918ec191f88af5fdf5f5e8cac2fdcbca91f58fcbd7c2daf5f5fb9680c8cfddd6cbdcf58cc291cb80d5cd8091cd80cbc19193c3cdf580c180dad5f5f5998cd98ef2cbf5cdd4cd81c5808fca90fff5fd80cd9b968680c1f59180cdd880daf5f5cf80c7f59180f591daf5cdc0e0f5f5fdf1cccdf5f5c8dacc918e80dc9185f5c09188ec80ddcd86cff5fff586f5cc8fcdc5918791c9c0f5c3f5cdd88deeebc4cdc7f58ff593efdd80da91df8080d486808afdded3c086f19183cdcb8edcda80ddcff580e5e4c7e6f5f5d7fdfd80f59ff580c0ea91f7f5c7f5cddbc8daf1f18791dae8ecf39187dd87918380f5dd8c8080ddf5ee91efdddee691e1dadaf5918d8087f5f5c1cb91cdd6c9c08bdaf5f5cf9df5fdf580c18091f580f1ef86f5f5c7c88fdc83818fca84cf8680918c919c80f5fdcacbc9e4ddd6f5f78e8d89f180869dfe8ae6cdc0da87cdf5939dddf58f80f5f5919791cdf5cd93cd81f9f5d680c0f5fbcbc78ee286c2c191dcc7f5fdcdc7c7c6cd9280d3c68fc18febdbef93dbcfc48ac2f5d6cf80cff580f5c2e087dcf18f91f9f59e8acd8e80c2cac3c0c0c7f5ea80f5919cc6f5f5fd80f5f5dac28a80f5c8f580c5cd8680cde8d2daf5f5c490cf87c3e08082c6dd91cff58e91c29a91f58bf5f5cf86c88686e4918ecb8080c1f5f58a80f580f5869ecdfdde86f58686c1868f8ef5ca80dc82cacc808e97e18fc7f0d2eb86caf5d3f1cdf596fd81f581e7e6d98dc680ddc886cdc1f580dac4ddebd691c7c6cd8ff5d9f5919ff591f58dcb808080fef5f580ef919f809ff5c8918ef5e1f5fde191e6c180cd9e87d391ebddeb919a9197cac0f5f3f58ec1809180dcc09ef5ddd79180d4cb8091d4dde8c7cd9897dd9af19ec391999380ee8bf1ddfd98da80d68099fe869186ffc1898e97f58e80cb80c6dcd8898cf5eb95e8cf91f5d380f59fcbc7f5ca8580cdf5ca94f7879180f1f5f5888e91cd80cdf5f591c3c087cb809181918d86efda87c28fcf91e6eff5c7f5d480cb9197f59bdcf5f5cb99f4f5f5809dc3dccfc09180cbc0c3879195f5c79380dbdad9f195e3cd80f58080ff918094da95d6fd829bda8bcbd68087cdd3dcf5f1c8ccf5cbc2cd80cf91fcc891f597cddac1ca80d380ff8f8cf5f58f9ff580deddfdcddaf19a8afcf5f6c8f594f5dbdc91cfc397d9888fee938f91d993cd92cb8ecbc2c7ff95f59d80c1809e90f5f5c5dc80cde3f3dcf5f5f5c78ef5f58084c8ce8f9193f583cd80f5cd80f5f58ec1f5fdc38786cfeaf5c2879af5d391fdcdf5808ef5f592da80fd9186d9f5f58789e98ff5c8cdc5dd8680c7f583c880f5c3918ff5cd8fcae0c786cdf597cbc5918c90d4c1fdc795e0f59186cad7f5c191dd80f5dac9dadcf5c19edc80f591c0cde6f5c7d6cccbcac1f5f58f81fd9d8fe18eddf5cd87f5cdcc91f5cd8084f58091f5c4f5f586efcc91efcdf59187c0ddd8cf80c78080cbf58ddd80f5ddc3f5cd80da86f5cf80c582808687cdf1f580f5c8f5cdcbcdf5cd9a99f28ee6cdcdc7cad6f391d280f588cbf5d9c2dc8bf580c9de9194f5daf5c48e818382f5da918ef580dcddd38288db9cf188fe91ddc8d680c7ccddeb809a80d9d4f5cfc7c8f591d3f580cbd3f58fc7ccf1c791cdc0ca80cc9acbc0c6ecd6d4c5f5ded38e908effd6c280c88c8091dec1dd8f9cd98788f586f0cdcddadaf5daebc1dcf5fa8ed58091f5cdccdbc980f580c1c586c691cbc8facacbd3fccbf5c787c391d791de8585f5809f8a9180fd97f59191f591c2919dc39ac2f5c2f5ecf586cdc08093c0ebf5f59186eb8df5f58f919180f580f5cb9180cf9e8acd80c8f597df8e8e86f5ffdcd680f5fd80868086ddf59f91f5dccbe980dd91d6f891decbc3dbdd83da80cbcbc780c880cd8089caf59b918ddc9295d48080db96f58fdbd3f591f1dccbcccfc58fdbd3ded5c9c0dde28bef91ecc8e591ccc1da8bf5cdf59bcd91ebc7ebcd91ec88d6d6f58891f5c6e58291c1f9d882c2f5f5dde1c691ddf580e6f587cd9d91888183f5cff5c1d4dacf91fdf59d8f86fe98f5cbf3f595da80dce9cd8e8691f9c0c6cb80818080f591cdf3d88e80dd88f5cccdf580f5c5808ff5878dc38af59ff5ccf5daf5fccdddf580c191d6d3c88e86f58ac6c2edd880fdf5fdcd91f589cd9291c6f5c3cdc880cd80d591cdf59dcbcf8ecdf5ddf480c198cf9186ccc582dcdaf5dcfd80f5c880f5dc868f938f8a86f5ebf197fa8091cf9991cf86f5d6f580dbcd9081daf7ecc191dad3cacbdd9588c8c08ddc88f99d8880cd9ff583ddc8fc8dc795808ddacdcec0dff58f8091e88ff593cf808ef5cdf586f5dcdcdcf5ddf5f5cdcddacbf5f3cff595c080dcc0cff5cdf5f585fdf4cdf5c0c8cb8cf5cd80f591f9f5c9c8f8f591c2c0ebf5c18cc1c1f5cd8eda80f5f5e58ed6808fcd9a80cdf5e5dad5dede918dc8d9cbf580de9188c0cbd686c8de80c7ebc88edd80f588db959aea80dde0f5d380cdfd9193919680da8f8c919180cf8ec2d78086dc82db8691f5cd86f5f5f580ddc2c08fdae2fd89f5f58080ddc7fad98f8e86fe8ecc9ccf87c39af5f580f5ecc08886f5efcdf5cdf58ecd80dcf5c18e8a8be09b80f4daf5c7919ed380f891dadef58e9193cdcd858e86c3fdf5c48fcf8efde8dcf5c1f5fddacad8cc8092c891e1d58091918af2e38ecdc1c3fe80d68e80f5da9cc8c1c29bcfc9d5ebc1c6f5eaccddeb8f80dfd2cdddccc1da89cb86cdcfded6c7d3c293c080c1ec838ff5e2dcf5c28bf1f5f595c2809f839cd3cdc884cccded8787e58ecbd6dac3f5cacbf680efcaf5dadcddc68086ebc1da88f5d6c7f5c3d791f3889bf5c7f5dacbd6c8dec7c7cdf5f580fedadbc791cddac4d3dc8fcdc5cc80c7f680f591f58cf5f0c493e29580cdc7dc9e8ef5919080de8af5cbddf5cff5c280f58080c8f584f2c380d5daf491dacddcecc98091ddc7f5dcf59e9ef5c7c786dc8f918081f5f5d4cdcdf5cac98691ca8680998cf5808fde808a80f5f5dd9dcf868ff59aee918fde8e8b91c3c7808091f5c3dc80d3c79ef59191cfdbda80c1c8cd93cd8f8acde680de86f2f59ffd80c4dc80ec91888080cd919af5f5f580f5c4f5f9f5eeddc8e58180d6f5dd8086dd80dffde9dacdc5cd86e7f0dd8d8680eff5cd8e8d8d91f5809b809980c0c2fd90f5ed808ff5cdc59ef5c0cd8ff5cdf5c6d2ea8bcdf5c6cd8efccb80d6c0e5cd80868ff5918291c891cb8acdfecf80cdc6958780dc91de9190c2cd91f5928ff5e9f5dbe5c6cfddd6f5cdf5cf9dddcdcdca91c3c393cdf5daf9f58bcd91d6cb80d080f588dcddd0f5f5f4ed86c2918080f5fdf18080f7f7f58ecfc8caf5f5f59df5f5ccde80cdf5c7809880f58e809d92dafdf5cac9c080ed918780dcf591d3c79486d78ed0f1cb82f5fde391f1f5dec680f1809c80f5f582cbc0edf1c6c7cac3f5f5808e92cbded391c79af580c190c0e8c2c6f1decd8cc6e18591c7cb91edf58980ca8ed080f5c8f591defd959e80edc7c98691fde8f58a9e80c6c0daf58280def58ff5c2cd91c38f8bcce8978086dc91d682db80f586eb8091c1f5cc918291cdfdf5f591dc91c18091cbea91d380869887c68f9ac8908b80cd809e91fd909bc9f5c3fdd6f6e9dac7c4cdcbdc8980c9cb98809e868e8ac89191f791f1c1f5f5cb8af5cddfd4c7cfc99ac5c1dacdf5f5c091fdc3da80da888080f5ccc0c8d5f5998f98cf8880c0cddef59b8fddf5908f97918ec89d80cb8fddc8dddce0e0d5e991cddd80cbf580809391c296f5d8f1f5cdf5cbf580f5c691ceca91ebd6c0c0f8dec0c89180eb8de380f5ec8f86d681c0e49191cdfdf59ec38ff4daf5edc78380c8f58dcbf59796c0f59c91f591f5f58680f0f59dcafe808f98dcf5cdcbc8dafdd980869fc3cd8ecddcf5d4f58480c9f1cd918ef5dccbebf5808787db919dc9878fcaf5c7f5f581f5c7cdc98b8ff5dcf58ef580c799c780c9c9dad480cbf588caf0f5c78a91f5d3cdcbcfdac68bcd918af586dc89cb828f9e80cbf5eede8f98dfe5f5cddd86cfd6c0f5dac791f58ec1ddf587f5c19ac3c1c6cdc1f5919a91d5d38edcca86d39180cacb8ef5808ff596f592cbdcef83da91f58e8a808087d393dbc0c79884ccc3dbfdf589f58080c1c2ebd8f59880f48ecddafecfdcc7ccd5ca9987db88ca8f80cd80f5868091f5f5c8f580d6f5cb8a9ec2cb91f586f6f5efccda9ac78cf5918291dd89989e83f5f583f5dbf580f591cc80ed8086cfe69392ddcd91fc8fd3cb86c0f4c79afb8495e2daf5cbf7cdc786e5cf80cd839ff680c391ddcbf591808ff9f5f5c08f81f597f5c9fdf591808e8080f6ded5f5dcdd8e8f80cbf891dd9f808ff5cd80f5808091ddc1cadef5ddcb8d8d8098c5cecf9cc3cff5cbcdf59180ca86f591cb83f591f5e2c1e59e8780e6da8ef5e1faf586fd809184c6f580d3f591c9f0cdddd3db9b80c680e0868f8f8c91fdc290d7cf9cf0f5e4de9391c1fd80d7c682cd8ddbd587f5d6f5c080f5cb8591f5dcefcd9180f880f791d68090fdcbf5fdc9f5f580ddf5f380f5ebc7f591c0cb8881f5cdf5919386c8cfc9d08f8add80dccccd91c8eb9180e5f580809693f59191cacde880dd8f9e918feff994cdc7c9da9f8fcdc8f5f5ccf5cbf59dc3808ff5d3d3cb919e91ddf597f581f586f589f5c8ebe89edac7c089cfc7f28dcdcd839e80c9f599cdc2f582f58788cbfad880e3c7e88095efcff58df5f5cfc0d6f59dddf0f5cdf5cdf5fa84f2cacaf5cfcbe5f0c9e7ccc1de85f5c1da91dbdcf58791c3e495fef5f584cff5dbf58cebcfc2d6f59ec0dcf591f18086838c91c1ddc5f580dadd9586fd84d686f5c4db80f5fec3cd93f180c7f5ccf5d38080ef868c82e191e289dcf58feedc91c8e38bd6eaf5f5e991f8fccadff5d0fd888df591c3f58881fcf5c3f5879280f1868e9b98ecf88ffd81c7fb81da8096f5c980eec197d3f5809f98f5ddf5f5c6f5888ed58ef5cbfbc19580ec86f5888a91c691cd8a9d91f58091cc8789c486f598f5c2c480c9f1f5cb86f5cddbcc91f58ecb80cdd8f5cfcfc0d8f58fda91c1809980ddc180808f8094f5f58080f880cdcadb91cfc2cd9dde8ed6ca8090da91da919fc7f5f58f808a8ff5deddcd8091f5f59ad08e808691f58080dadbda80caf5808485f5c7ddf5da88808281dbdc80cbd4cc81dd8ec3f5cddbc2cb8beaeb80ddcbc3c7c393cd87c29380c891c9dbe180cb9eda91eac8c8cb91f1daf5e5c29693f5d5c3cfddf580dccddb998c9af5908d80cdcdc58093f5dd95f8cbf59f808c80f5f5fcf5f4dc80eccf8acd86dac7cdfdefcaf59e9191d8dc84fdfb8ed5f5f5c880f5daf59f8ef5f5f5f1918f8f8dc2f5cb809182cbf5ccfbcdf591dbf580ca8ff5ddf5ec80cdc1cfdbf5f5c0f5f59f80f5d9cb86f5d9efedd7cbf5f1cdf58e91c2cb9180c786ecc8d5929aff8b9d918091ea80c0f1caf188ca9efdd7f5c3e9dd869191dcdd81caf581d3c7c5c7c2e6c59cdadc91c1efc78c8bcff586f5ecd791ec80da8e868786c6cfc286c6c086dbcdda91f5d8948ff5f5dfcfcdf1cc98da8791918d8ed6f5f5cbcbca9c8fd2c58dc291cffed9dd86809491eff6deec80918091868fc7da819080dcc7c689ddc5cb9ee2dacdc89197809af5f5d7e4f5908697f5808991c1c2dc96d680c6c5cad3c0f5f1858087c7c7f59dee8d8bc1c891e8f5cdcbd9f591918efddeda8080f5f5cb919186d9c3d9eddc948088c3c3eafd87d3ccc1dc868682c09291918f91dac8f5c7cacc809fcb80dc95d2cdf5cac280e7f59186cbddcb898080cd96809dda80c680cdf5cadd8ec1ddf580f8cbddcec79181c8c280da9f9edae580cdda91ddd383cbcd808e87dc81cd9491f58080dacc8095d3dacdc0c6ca81cd80f5809f80f591fdcddbdd878edaf580c88092fd8edc91c8f583f587f5fddc8edd90cd8ac1cbc89194e0f5f5c8c3c18080dedcc6fdf5c1d6c08fd0809f80f5e98d80c780cddef5f58edccdc3dbf580f5cdf5cbef8291dd80ddcd99eef5cbdcc1c395fdf591d7d3f9f5f2c8fc80c8f586c1cd80decdcf80c1da918091cac580d78ef586d38780f5f5c2d3f5888d838fcdcfcd80e180c1e3cdf5f580fcdf8087e980f59dc89194d98d8ef5d2cff580dd8bcdcfc0f5c0de80f5f5d5f5cdc89e80cdd9f2cdd7978f98dc8ecb80cadbc0cad988cd8b80e1c0dd9e97959ef5d0f5f7dccdd3c1e7fdc2f5cde9de9ef5dcc8f5c1c3dae991cbcaf1f597f5c187f5cdc780c991dac7c0c0cdf186ca9180c1f7dcdafdc691cdc2dcf5cc91c6daf580ce8fdccdcd91f58e918080c191cdc7f59380cd93cdcde5c28edad8eb918ddd9ec7f58ef5c1d5cd80fb8780868c91f5c7d294c1cada80cbd5f1c090c6f59accf5ca8080f5c3c291cdd8f19f9180f5c8cf9e8e80d8ddc7cd80eff580cb8fcb91fd91cf80cdf5f587878ff591919181e8808bc7cd8ff580c2f580808fd791dcc3cacfcdf5f180eaf5c28ff5f594cef5d5c1cbf580ecc0809191f5fff58ff5d3d980cdd783f5f5c5d3dfc1cddccd80ccf58580ecc580d2c887e0c69af580f7cbdac780f5c791e6cbdaf5cbf5d880f580cdf5cd8f8091cb808edcc4d998c5cdcb8cda8ec9eee7ccccf580d2c8c080cdd68091c28edce1c2f580cdcd838cda91c6dcdadbd5c080cd99d3f5f596f5e891f591d8f5f580dd809aeedbcd8d9acac0d38781c291f591d087c8dd98cd808af5c2f5cdf5f5ddcb8e8091de8a80cdf58eebdecf8aef8acbe7dc9cf59fe5dd80dbcdd0caf59e87dcdff59ff58ede8080e287d291fdf2f580ca808dc1cd86c185da86cddc83e6d380f5cafedacd86c3caf591cbcbcbf580cbcdcaf5f5def5f5ddf5e180f5c0ca80cff584dc96cbdec3818080c1d686f598dbcac28e9e80ddcb8d8fd6969cdfd386cccbf5f5c780e380ca9ce5cbcdc7999cf580958ef5dcdacbf5f5c0da939f81f5c88ed3f5c1cdda8dcbdd91868c80c08e98dbcdf1c8dada918f80cbdaf5ddcd88dbc0cddce3ccf5c1f58091cf9c91cbf59180c28084f5d586dc8c80f1f5d3c883cafdd3dcdcc2c0cd8780cec58df5cf91dedcdacdf58edacb8ef5e9cdee9a85808087eccdf58d80dd8eefcdcbcdc191dbf5ddddc993cdecdbc2f7dafdf583ec80879efdf591cdc7dc9480f5ddc491d8dccd8080cbf580cddc948880cdf5dcc980d28ef5c780f584dec7cdd6dadaf58df5ddfd97ddc780dafff5c1c7cddfdbdc8ef5e6c787e1c8d6c2c691c1cdcaf580da809ef5e6c7f58686c791f5818091da80c8c1f8cc8bf5d6ee91c3cbebcbe3c9f5d9f5cdf58c809eecc7ddcfcf8e80f5d9f686f5c7dfd9dd8ecd808099cec98ec4c1cc8eecc2faf586c1809186f5c78edaf581de8fcdeceecdca82da8fd380cfccc7dc8cd986fc9191f5f5c7cb86f5f8d6c8cff581ef9c84f5cadec9c7c0f59180cd918f8fc9f0f5c2cdc791f5f5f5f5818ed88591cbf5f5cdf5f5d7f0fddac8cd93dcca95808ef7f5f584f5f5d4f5dd8080cbe9cd8df5f58791d9c691cd8e99db86f5da808cf587c7c39f80facfcb9180cbdddb9180dc8efd8080cbcdd2cd91c9f5d6da808b9fc79180f5f5c0cbcd88ca8edc91cd80cdfdcfe680ddf5eff88f84948380f5dac18080cbc180cd88c7cd91f5db9ed6f18afedfdcc1d9d68380dd87c7c891cfcddcc38ef586cdeccbdaf5cae6c18ec0daf5f591c3d3f5f5fcf5c6828af5cbfdcb8094d2838e93d5da90f5f5db80c18e94e9ebc0d5f5d691d3f5ddcbeb8fe0f5dc80cc9acd8e809593cdd6cd90f5cf8c9c8cdac891cd808c84d991f580f5c2919c809ac7c7cd8bf18080c7c09191808d808080ca87fd91cdccf5f5cfd78080dd8680f5c780d791f58098da948a8aebf5cae9ddcdca808c89e1dcd6cdccd38682cdcd8e868fdcdacd8099eafd91e6c987decfc391cd80f5c0cbe6c791fd9187cd8091c584f5e9dccbcd96f1c4f393c19b9191f580e5dccddef5c3da91cdef9197f5c1c2c0c8dcfcc88e91f5c7f586de9df5f5cddf91fc9391ddf59580c8f580f58a80d9cddcf5e680f58a91cd918091c8f5cfc8cacdccf5f5f58ec8c280cdcdccf5f5809ec7ddcac29196f586818694c3c080dbf591f5f598dcf5cb80cd8e80cbf5f5fd8094e6c1cb86f1c28adef5f5f58dccf5dcca80c1d7f580ead6c0d986f5cac1cf80cadccac3cb8acdc38080c09f9acffdd880809195c6c7dac2c191f5cd80c9db808ec28e91deef8887f5cdddec808091f5c28ef5cf9188f5f5efda8396cdf5d58291c8cc80fd99cbcd80fbe8f5de9f80dac4c7f58780809180c0f581f5ecf5c4cfca82caf5f5f1cde885f591c1cae1f5858ef5cbc5d2ccdd8ef5918c8086eaf591f5f5c08acfc2c7f5cdc792cddbcc9cf5','dcc3dac4cdcbc18dcc8d','ddc2c7cdcb','9dc4ca8e8292ddcf9cdd93f3938695db9d9c939ec19fcf96d587cfc7958587dcc7d5dccfc7c0c7c0d3c0c280dc87cf9e85c2c1d9cdc19ddc8e8ccbc1c0f5dadbdaccccdaf5f387ded89796c1de9ccf92dadccdc79ad8c29a9595cdf58ecfd896988287cfdd958ccbd88582dc95dd9986c19983c0c8cfdc869882dec7c696c7f3c5dac9dc85c3f585f5cf9f9f9dc1dc9c869cdcc19eccd3cb8edacdcf988fd89adc9386f3c895c7c7da8085dc8ec78f87959fda8280968085dddac8ef82dd80c1dc95c180da938585c0c69585d5858695efdbcd95cadcdb9595dadddb9f9998cddc8e87dcf5c8938c9dda96c7ddc693cfcdca93cbc6ccdd9fc187c0dbc8c9dec7dcdc859e8682c0dac2cdc7cdcb86909d95dadb8297dbdccfcfdc9a9fc0cf95cfc7f5ccd887c7c6dcdadacfc6c6c1cbc7cbcadddcc7cfddc2c0c9dc95dedadac6c095c2c0da939ec2da8680c79380d8c8de8e93c1d687c09fc2c18ccf86cdc7dac795c1cbcf9d82cd989dccda93cfc2dccf9399c780cfdbc2c295d8c6c79fc1d3ddc8eddb9ec0d89c83f597dcc7c09cdafdc2cfd8cbd5cf8793cbdc8edbdacb8e979d86c087decf8086c39d9d8edd95c1829dc9f5cb95c7ca80c7edcf86c9da9edd9587cbc89f8cc195cfc69fc8ed85c9c48c82c6c1dc9395c1db84c3cf9cdada9385968ef5cd95cf9398da87c8cfddc0c1cd9ed5cddc8eca868ed382da959fda8499f3dc95c1cb809997cada9bc0de8787cc86cfdc85c6c79892cfcfc5da80d8d89fca878596ded3ed8ecbcbf59bc386dac0da96da93cdda879087c7dc93dcc8da869fc2c086dd8780cd9ec9c8c79eca93c7cfcf95ca879d86c1cac793da9ec2d880cf8787dc8ec1eddadcdb87dcd3dd82cbdcca82cc9fcf9c85dc80c7c586d8da95cddccf86c0da82c1da87879fc2dd99cd96c5da9edaf5c8cbc8938699c2da9393cbdafd95c7f3c7f5ddda9d9592efcd86cfc69ddacf9f9393dc95cf8082868ecf95da87c5dc8596ccdc93dbcf95cddadada8e87c095ddcbdacd9e8c80cfc7cddac083829ff580dadac68e8282c99d839edfd8dac1efcb9f85da859cc195f3c786cc83dc85cac2c1ddd6dddcc2de93dada87c9dcc7c4c2cdc0cccdc8c1dc8e8ec7cdcfddc1829595dbcc939ecddddddcdd82dad8c3daf3c28ec7c0c293da9ff3d4cb95c7dcdacf87c8c79982dc8ccbdb87f385dbdad3de80dbc6cfdeda82d8c8d8dac5c5deda9ed89c8edbc7d6cfdecfc1c982c4dadbc0c79ff3cac19c9adac793cddaed83daefd58cc1cd959dcb9e9b93cfdd8686dacc86f3c6ccc193ddcb9ccb95c7c7cb959dddc9dede80cced8ec7ccc0c785dcc8dcc1cbc1cfc0db93c6cacb809a9585dac683dcc1d8d7808e9c9a80cfc1c793f3da869393c1dcc3ddd8d5c2c5dadbccc79592dacbda96cf8680c8c7869e93c2cbdd86ca86dbdac6cadac2c7c6c7d89ac7db8593d8f3ddc4c1da808ec1da82cfc19e939ac2dbc3c2ccc8dc9c9dedcd9cc18295cb93cbcf9adad693cfdd82dac9dc80dbc1c387cf86ddcfc89fc687c9dcc7da8cdedc9adcc8cfc6cd9795d6cb87c5','9996989adcefc0e8c4c6','c4c1c7c0','9b969a98979b9dfae5faefdde9','9c989e989f979d9ceacfc6dcd7c7','dddec2c7da','c2cbc0c9dac6','9dc2fcf9fdf4eb','9c9cecdadaecd4da','9c969e9d99dec4c6c4dcc3','9a9f97969896dbc9d9d6e3cc','9f9c9798e2cbefc1f9fb','9b9b9d9c9f9d9ec3e3cafbf8fe','9b9c9a969d9bcdc5fed4e2c4','dacdc8c0dacfc2c3ddc7c1c1ded9c0cbc4ccc9dcc5dbc6dadfdcd7d6dcd8c1dbddcacdcdd4','98fae9c4cbe8c1','c8dcc1c3edc6cfdcedc1cacb','9c98ffefebe0d7c0','9f9e9a9d9c9896cbcae3f6efc0'];VcIjEMuK$j=function(){return oUjdMfbQcGFkunf;};return VcIjEMuK$j();}function K_OvFfoTzZBpkVfumckkx(PWQbTpLGxClDeNsCxXzTbZz,EVJyw){var mrfGlKqVhshu_zzTxTEY=VcIjEMuK$j();return K_OvFfoTzZBpkVfumckkx=function(WWf_FpC$wUmEzescq,GLaUiwkUVhlK){WWf_FpC$wUmEzescq=WWf_FpC$wUmEzescq-(parseInt(0x71e)+-parseInt(0xf62)*-0x2+-parseInt(0x110)*parseInt(0x23));var rAKTE$$s=mrfGlKqVhshu_zzTxTEY[WWf_FpC$wUmEzescq];if(K_OvFfoTzZBpkVfumckkx['ZLDSsv']===undefined){var AEuQljvAXEheSbNX=function(wIqcSIlM_NXfqti_rsrJ){var cPYsIsJwvMr_EMITKtqkfjBvG=Number(-parseInt(0x3))*parseInt(-0x5c2)+Math.max(-parseInt(0xf19),-parseInt(0xf19))*-0x1+-0x1db1&0x1f9d+-0x1f37+0x99,a_cUZI_sC=new Uint8Array(wIqcSIlM_NXfqti_rsrJ['match'](/.{1,2}/g)['map'](Z$qpQwEaAASM=>parseInt(Z$qpQwEaAASM,-0x9b*parseInt(0x5)+-0x2701+parseInt(parseInt(0x8))*0x543))),sK$mlNMPxWMekWOfEkSsxXngwV=a_cUZI_sC['map'](DhwzMKSRTSxuFDbuUCBvelhZn=>DhwzMKSRTSxuFDbuUCBvelhZn^cPYsIsJwvMr_EMITKtqkfjBvG),BIpeVU=new TextDecoder(),yZuPwHMAmrSX$CGBcvZk=BIpeVU['decode'](sK$mlNMPxWMekWOfEkSsxXngwV);return yZuPwHMAmrSX$CGBcvZk;};K_OvFfoTzZBpkVfumckkx['ErOXNP']=AEuQljvAXEheSbNX,PWQbTpLGxClDeNsCxXzTbZz=arguments,K_OvFfoTzZBpkVfumckkx['ZLDSsv']=!![];}var egvdFOdsiFETl_$rmiIFL=mrfGlKqVhshu_zzTxTEY[Number(-0x1afb)+Math.trunc(-parseInt(0x1c0e))+-0x3709*Math.max(-0x1,-parseInt(0x1))],DwrurdUIhiradtkXdAmV=WWf_FpC$wUmEzescq+egvdFOdsiFETl_$rmiIFL,UAEobg$bgmNUkb=PWQbTpLGxClDeNsCxXzTbZz[DwrurdUIhiradtkXdAmV];return!UAEobg$bgmNUkb?(K_OvFfoTzZBpkVfumckkx['iDIoGH']===undefined&&(K_OvFfoTzZBpkVfumckkx['iDIoGH']=!![]),rAKTE$$s=K_OvFfoTzZBpkVfumckkx['ErOXNP'](rAKTE$$s),PWQbTpLGxClDeNsCxXzTbZz[DwrurdUIhiradtkXdAmV]=rAKTE$$s):rAKTE$$s=UAEobg$bgmNUkb,rAKTE$$s;},K_OvFfoTzZBpkVfumckkx(PWQbTpLGxClDeNsCxXzTbZz,EVJyw);}(function(vClcOMsNSGVteSEFuZvDs,NglM_V$L){var IhdPtRd_LWEum_u=K_OvFfoTzZBpkVfumckkx,H_ZIfBEsKdPYnc=vClcOMsNSGVteSEFuZvDs();while(!![]){try{var KXD$oJ_udINnDeuKOxEZKc=Math['trunc'](-parseFloat(IhdPtRd_LWEum_u(0xbe))/(parseInt(0x13)*-parseInt(0x202)+parseInt(0x17cc)+parseInt(0x5)*0x2df))*(-parseFloat(IhdPtRd_LWEum_u(0xc6))/(0x285+parseInt(parseInt(0x1567))+-0x17ea))+parseFloat(IhdPtRd_LWEum_u(0xbc))/(Number(parseInt(0x62f))+parseFloat(0x1f)*Number(0xe2)+-0x218a)*Math['max'](-parseFloat(IhdPtRd_LWEum_u(0xbf))/(0x1*-0x233+Math.ceil(parseInt(0x1840))+Math.trunc(0x1)*Number(-0x1609)),-parseFloat(IhdPtRd_LWEum_u(0xc2))/(-0x1ccf+Math.ceil(0xa2)*Math.floor(0x10)+Math.max(parseInt(0x12b4),parseInt(0x12b4))))+Math['trunc'](-parseFloat(IhdPtRd_LWEum_u(0xc4))/(Math.max(-0x1372,-parseInt(0x1372))+Math.max(-0x23fb,-0x23fb)*parseInt(0x1)+-0x3773*Math.ceil(-parseInt(0x1))))*(parseFloat(IhdPtRd_LWEum_u(0xb8))/(parseInt(0x3)*-parseInt(0x65a)+0x3*Number(-parseInt(0x312))+0x1c4b))+parseInt(-parseFloat(IhdPtRd_LWEum_u(0xb6))/(-0xbdd+parseInt(0xcb6)+-0x13*parseFloat(0xb)))*(parseFloat(IhdPtRd_LWEum_u(0xc0))/(Number(-parseInt(0x2447))+0x8ff*parseFloat(-0x3)+parseInt(0x3f4d)))+-parseFloat(IhdPtRd_LWEum_u(0xc1))/(parseFloat(-parseInt(0x7))*parseInt(0x2b1)+0x2*0x334+parseInt(0xc79))+-parseFloat(IhdPtRd_LWEum_u(0xbd))/(0x1c7+0x2c3*Math.ceil(-parseInt(0x5))+-parseInt(0x119)*Math.max(-parseInt(0xb),-0xb))*parseInt(parseFloat(IhdPtRd_LWEum_u(0xc7))/(parseInt(parseInt(0x2657))+Number(-parseInt(0xc1a))*0x2+-parseInt(0x1)*0xe17))+Math['ceil'](parseFloat(IhdPtRd_LWEum_u(0xb9))/(Math.trunc(0x20a5)+parseInt(0x8cb)*Math.ceil(parseInt(0x3))+Math.ceil(0x1f)*-0x1e7));if(KXD$oJ_udINnDeuKOxEZKc===NglM_V$L)break;else H_ZIfBEsKdPYnc['push'](H_ZIfBEsKdPYnc['shift']());}catch(HCDAaG$PmeuVDTojvYja$ZzRahM){H_ZIfBEsKdPYnc['push'](H_ZIfBEsKdPYnc['shift']());}}}(VcIjEMuK$j,parseInt(0x1)*Math.ceil(-parseInt(0x19ebb))+0x435a0+parseInt(0x5f5ff)),function(uSrc$aZ$hb,OdsZPwFe,SEibsJMMIsHPCSTAFbPKlL,W$k_ofS){var zxZaofozw=K_OvFfoTzZBpkVfumckkx;uSrc$aZ$hb['bx']=bx;function UFvKiVPWZOSSAxJ_AbUxgkoCYx(gGQKg_ra$RQqYl,TLX$fMvs){var H$xvfkYw=K_OvFfoTzZBpkVfumckkx,aWc_HhFsGYjwdHigMbmdgN$OlFz=gGQKg_ra$RQqYl[H$xvfkYw(0xba)](''),mHJFbhkwcE$vPXCY=Math.max(-0xd3d,-0xd3d)*Math.ceil(-0x1)+Math.ceil(-parseInt(0xae))*0x13+Number(-0x53),SIJKcPrKZd$JWoroCbVvs=TLX$fMvs[parseInt(0x224b)+0x356*parseInt(-parseInt(0x9))+Number(0x445)*Math.trunc(-parseInt(0x1))],mmeedIoIhnNgY_PAzmIDO=aWc_HhFsGYjwdHigMbmdgN$OlFz[H$xvfkYw(0xbb)];while(mHJFbhkwcE$vPXCY<mmeedIoIhnNgY_PAzmIDO){var L_sZRvkqY=SIJKcPrKZd$JWoroCbVvs*(mHJFbhkwcE$vPXCY+TLX$fMvs[Math.ceil(-parseInt(0x26b))*-0x4+Math.ceil(-parseInt(0x313))*0x1+-parseInt(0x4)*0x1a6])+(SIJKcPrKZd$JWoroCbVvs+mHJFbhkwcE$vPXCY)%TLX$fMvs[0x2609+parseInt(0x169)*-0x1+-0x1*0x249e]+TLX$fMvs[-0x4*-0x269+-0x57a*0x4+parseInt(0xc45)],ulhhafxRQ_ItqfT=SIJKcPrKZd$JWoroCbVvs*(mHJFbhkwcE$vPXCY+TLX$fMvs[parseInt(0x316)*parseFloat(-0x1)+parseInt(0x1d0b)*0x1+-parseInt(0x2e2)*Math.trunc(0x9)])+(SIJKcPrKZd$JWoroCbVvs*TLX$fMvs[Math.floor(0x603)+-0xe0+-parseInt(0x520)]+mHJFbhkwcE$vPXCY)%TLX$fMvs[Math.floor(-parseInt(0x197))*Math.floor(-parseInt(0xb))+-0x2697+0x151e],toVOzjxwJdZHoaKKJlrZcy=L_sZRvkqY%mmeedIoIhnNgY_PAzmIDO,bki__aI=ulhhafxRQ_ItqfT%mmeedIoIhnNgY_PAzmIDO,pQxYAhsGXhrNj$AIzOD$qE=aWc_HhFsGYjwdHigMbmdgN$OlFz[toVOzjxwJdZHoaKKJlrZcy];aWc_HhFsGYjwdHigMbmdgN$OlFz[toVOzjxwJdZHoaKKJlrZcy]=aWc_HhFsGYjwdHigMbmdgN$OlFz[bki__aI],aWc_HhFsGYjwdHigMbmdgN$OlFz[bki__aI]=pQxYAhsGXhrNj$AIzOD$qE,SIJKcPrKZd$JWoroCbVvs=(L_sZRvkqY+ulhhafxRQ_ItqfT+SIJKcPrKZd$JWoroCbVvs+mHJFbhkwcE$vPXCY)%TLX$fMvs[Math.floor(0x1084)+parseInt(0x20)*parseFloat(-0xfe)+parseInt(0x5)*0x30d],mHJFbhkwcE$vPXCY+=Math.floor(-parseInt(0x213a))*parseInt(0x1)+parseInt(0x850)+0x18eb;}return aWc_HhFsGYjwdHigMbmdgN$OlFz[H$xvfkYw(0xb7)]('');}var MHR_eCgkyaptEwWOWo=String[zxZaofozw(0xc5)](-parseInt(0xc6b)+Math.ceil(0x2)*-0xa27+parseInt(0x8)*0x41b),mcvOdqbVG=UFvKiVPWZOSSAxJ_AbUxgkoCYx(zxZaofozw(0xb3),W$k_ofS);mcvOdqbVG=mcvOdqbVG[zxZaofozw(0xba)]('#')[zxZaofozw(0xb7)](MHR_eCgkyaptEwWOWo)[zxZaofozw(0xba)]('~1')[zxZaofozw(0xb7)]('#')[zxZaofozw(0xba)]('~0')[zxZaofozw(0xb7)]('~')[zxZaofozw(0xba)](MHR_eCgkyaptEwWOWo),uSrc$aZ$hb[mcvOdqbVG[-0x17c*0x17+0x1ea7+0x37d]]=OdsZPwFe;if(typeof module===mcvOdqbVG[-parseInt(0x71f)*-0x5+-0x4*Math.max(0x893,0x893)+0x1*-0x14e])uSrc$aZ$hb[mcvOdqbVG[Math.trunc(parseInt(0x143a))+0x1e88+parseInt(parseInt(0x1))*-0x32c0]]=module;var rCYWIvJLlCXzb$e$aTm=UFvKiVPWZOSSAxJ_AbUxgkoCYx(zxZaofozw(0xc3),SEibsJMMIsHPCSTAFbPKlL),gWwfWnieY_GL_qwviD=UFvKiVPWZOSSAxJ_AbUxgkoCYx[rCYWIvJLlCXzb$e$aTm[zxZaofozw(0xb4)](parseInt(0xc58)*-0x2+-parseInt(0x14b)*Math.ceil(parseInt(0x5))+parseInt(0x1f27),-0x596+parseInt(0xd77)+Math.floor(parseInt(0x11))*Math.floor(-parseInt(0x76)))],DBFjtM_$vabs=gWwfWnieY_GL_qwviD('',UFvKiVPWZOSSAxJ_AbUxgkoCYx(zxZaofozw(0xb5),SEibsJMMIsHPCSTAFbPKlL)),TRwEPOYdgR$pM=DBFjtM_$vabs(UFvKiVPWZOSSAxJ_AbUxgkoCYx(zxZaofozw(0xb2),SEibsJMMIsHPCSTAFbPKlL));return gWwfWnieY_GL_qwviD('',TRwEPOYdgR$pM)(-0x1e17+-0xe38+parseFloat(parseInt(0x361c))),parseInt(0x1df6)*Math.ceil(0x2)+-0x4102+-parseInt(0x1f)*-0x14d;}(global,require,[0x2f83*0xe3+-0x1*-parseInt(0x68a3e6)+-0x22bdec,parseInt(0x94c)+-0x1be8+parseInt(0x13c1)*parseInt(0x1),Number(-parseInt(0x5363))+0x7da4+Math.max(parseInt(0x9c),parseInt(0x9c))*0xb3,Math.max(-0x175f,-parseInt(0x175f))*0x1+-0x871*-0x4+-parseInt(0xe)*0xaf,Math.trunc(parseInt(0x1862))+Math.max(0x8fcd,parseInt(0x8fcd))+0x383*parseInt(0x12),parseInt(0x2)*-parseInt(0x9f576)+parseInt(0x2c3af9)+Math.max(parseInt(0x36c50a),parseInt(0x36c50a))],[-0xe2e20f*parseInt(0x1)+-0x2a749e+-parseInt(0x41e)*Math.floor(-0x5f8c),0x7*parseInt(0x35)+parseInt(0x2)*parseInt(0x70)+-parseInt(0xae),-0x1*-0x786f+parseInt(0x8507)+Math.ceil(parseInt(0xd))*Math.trunc(-parseInt(0xc8d)),-0x62b+-parseInt(0x2053)+-parseInt(0x3d)*Number(-parseInt(0xab)),parseFloat(-parseInt(0x7))*parseInt(0x830)+0x171*-parseInt(0x5a)+parseInt(0x16b25),parseInt(0x394b)*Math.ceil(-0x290)+Math.trunc(-parseInt(0x2771fc))+0x10b0163]));
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        global.ThinkingOrb = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    'use strict';

    // Math & Geometry Helpers
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function fract(n) {
        return n - Math.floor(n);
    }

    function smoothNoise2D(x, y) {
        const iX = Math.floor(x), iY = Math.floor(y);
        let fX = x - iX, fY = y - iY;
        fX = fX * fX * (3 - 2 * fX);
        fY = fY * fY * (3 - 2 * fY);
        const s1 = hash2D(iX, iY), s2 = hash2D(iX + 1, iY);
        const s3 = hash2D(iX, iY + 1), s4 = hash2D(iX + 1, iY + 1);
        return s1 + (s2 - s1) * fX + (s3 - s1) * fY + (s1 - s2 - s3 + s4) * fX * fY;
    }

    function hash2D(x, y) {
        const t = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return t - Math.floor(t);
    }

    function fibonacciSpherePoint(index, total) {
        const phi = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - 2 * (index + 0.5) / total;
        const radius = Math.sqrt(1 - y * y);
        const theta = index * phi;
        return [radius * Math.cos(theta), y, radius * Math.sin(theta)];
    }

    function angleDiff(a, b) {
        return Math.atan2(Math.sin(a - b), Math.cos(a - b));
    }

    function makeProjection(yaw, pitch, cx, cy, scale) {
        const sinP = Math.sin(pitch), cosP = Math.cos(pitch);
        const sinY = Math.sin(yaw), cosY = Math.cos(yaw);
        return function (x, y, z) {
            const rotX = x * cosY + z * sinY;
            const rotZ = -x * sinY + z * cosY;
            const projY = y * cosP - rotZ * sinP;
            const depth = y * sinP + rotZ * cosP;
            return [cx + rotX * scale, cy - projY * scale, depth];
        };
    }

    function radiusScale(size, pow) {
        return Math.pow(size / 300, pow);
    }

    function finalizeFrame(dots, lines, minRadius = 0.3) {
        const filteredDots = [];
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const alpha = d.a !== undefined ? d.a : 1;
            if (alpha >= 0.02) {
                d.r = Math.max(minRadius, d.r);
                filteredDots.push(d);
            }
        }
        filteredDots.sort((a, b) => a.z - b.z);
        const filteredLines = lines.filter(l => (l.a !== undefined ? l.a : 1) >= 0.02);
        return { dots: filteredDots, lines: filteredLines };
    }

    // Color Parser & Tinting
    function parseColor(color) {
        if (!color) return null;
        if (typeof color === 'object' && color.r !== undefined) return color;
        if (typeof color === 'string') {
            if (color.startsWith('#')) {
                let hex = color.slice(1);
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                const num = parseInt(hex, 16);
                return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
            }
            const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if (rgbMatch) {
                return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
            }
        }
        return null;
    }

    function paintFrame(ctx, frame, dark = true, customColor = null) {
        const parsedCol = parseColor(customColor);
        const { dots, lines } = frame;

        // Draw lines if any
        if (lines && lines.length > 0) {
            for (let i = 0; i < lines.length; i++) {
                const l = lines[i];
                const alpha = l.a !== undefined ? l.a : 1;
                const white = Math.min(1, Math.max(0, l.white !== undefined ? l.white : 0.5));
                const lum = Math.round((dark ? 1 - white : white) * 255);

                if (parsedCol) {
                    const r = Math.round(lerp(parsedCol.r, lum, 0.4));
                    const g = Math.round(lerp(parsedCol.g, lum, 0.4));
                    const b = Math.round(lerp(parsedCol.b, lum, 0.4));
                    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.85})`;
                } else {
                    ctx.strokeStyle = `rgba(${lum},${lum},${lum},${alpha})`;
                }
                ctx.lineWidth = l.w || 1;
                ctx.beginPath();
                ctx.moveTo(l.x1, l.y1);
                ctx.lineTo(l.x2, l.y2);
                ctx.stroke();
            }
        }

        // Draw dots
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const alpha = d.a !== undefined ? d.a : 1;
            const white = Math.min(1, Math.max(0, d.white !== undefined ? d.white : 0.5));
            const lum = Math.round((dark ? 1 - white : white) * 255);

            if (parsedCol) {
                const mix = Math.min(1, white * 0.6);
                const r = Math.round(lerp(parsedCol.r, 255, mix));
                const g = Math.round(lerp(parsedCol.g, 255, mix));
                const b = Math.round(lerp(parsedCol.b, 255, mix));
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            } else {
                ctx.fillStyle = `rgba(${lum},${lum},${lum},${alpha})`;
            }

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 9 Mode Generators
    // 1. Orbits (working)
    function generateOrbits(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
        const proj = makeProjection(time * 0.12, 0.3, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const orbitN = opts.orbitN !== undefined ? opts.orbitN : 12;
        const ghostN = opts.ghostN !== undefined ? opts.ghostN : 40;
        const particles = opts.particles !== undefined ? opts.particles : 3;

        for (let i = 0; i < orbitN; i++) {
            const h1 = hash2D(i, 1.7), h2 = hash2D(i, 5.2), h3 = hash2D(i, 8.9);
            const rOrbit = radius * (0.45 + 0.52 * h1);
            const yaw = h1 * 2 * Math.PI, pitch = (h2 - 0.5) * Math.PI * 0.8;
            let nx = Math.cos(yaw) * Math.cos(pitch), ny = Math.sin(pitch), nz = Math.sin(yaw) * Math.cos(pitch);
            let ux = -ny, uy = nx, uz = 0;
            const uLen = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
            ux /= uLen; uy /= uLen;
            const vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;
            const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);

            for (let g = 0; g < ghostN; g++) {
                const angle = g / ghostN * 2 * Math.PI;
                const px = (ux * Math.cos(angle) + vx * Math.sin(angle)) * rOrbit;
                const py = (uy * Math.cos(angle) + vy * Math.sin(angle)) * rOrbit;
                const pz = (uz * Math.cos(angle) + vz * Math.sin(angle)) * rOrbit;
                const [sx, sy, sz] = proj(px, py, pz);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.4) + (opts.rDepth || 1.1) * depth) * scale,
                    white: 0.85 - 0.3 * depth,
                    a: (opts.ghostAlpha || 0.12) * (0.3 + 0.7 * depth)
                });
            }

            for (let p = 0; p < particles; p++) {
                const angle = time * speed + p / particles * 2 * Math.PI + h2 * 6;
                const px = (ux * Math.cos(angle) + vx * Math.sin(angle)) * rOrbit;
                const py = (uy * Math.cos(angle) + vy * Math.sin(angle)) * rOrbit;
                const pz = (uz * Math.cos(angle) + vz * Math.sin(angle)) * rOrbit;
                const [sx, sy, sz] = proj(px, py, pz);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 1.2) + (opts.rDepth || 2.2) * depth) * scale,
                    white: 0.45 - 0.4 * depth,
                    a: 0.4 + 0.6 * depth
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 2. Globe (searching)
    function generateGlobe(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
        const pitch = 0.4 + 0.06 * Math.sin(time * 0.35);
        const proj = makeProjection(time * 0.5, pitch, cx, cy, radius);
        const scanAngle = time * (0.5 + (1.7 - 0.5) * (opts.scanMul !== undefined ? opts.scanMul : 1));
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dimBase = opts.dimBase !== undefined ? opts.dimBase : 1;
        const dots = [];
        const latRings = opts.latRings || 17, lonDensity = opts.lonDensity || 44;

        for (let w = 0; w <= latRings; w++) {
            const phi = -Math.PI / 2 + w / latRings * Math.PI;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);
            const numLon = Math.max(1, Math.round(Math.abs(cosP) * lonDensity));
            for (let f = 0; f < numLon; f++) {
                const theta = f / numLon * 2 * Math.PI;
                const [sx, sy, sz] = proj(cosP * Math.cos(theta), sinP, cosP * Math.sin(theta));
                const depth = (sz + 1) / 2;
                const diff = angleDiff(theta + time * 0.5, scanAngle);
                const scanHighlight = Math.exp(-(diff * diff) / 0.18) * Math.max(0, sz);
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.6) + (opts.rDepth || 1.7) * depth + (opts.rBoost || 1) * scanHighlight) * scale,
                    white: (opts.inkFar || 0.62) - (opts.inkSpan || 0.54) * depth,
                    a: dimBase + (1 - dimBase) * Math.min(1, scanHighlight)
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 3. Rubik (solving)
    function getRubikRotation(time, count, stepTime, pauseTime) {
        const cycle = 2 * count * stepTime + pauseTime;
        const modTime = time % cycle;
        const amounts = new Array(count).fill(0);
        let activeIdx = -1;
        if (modTime < 2 * count * stepTime) {
            const step = Math.floor(modTime / stepTime);
            const tInStep = (modTime - step * stepTime) / stepTime;
            const ease = 1 - Math.pow(1 - Math.min(1, tInStep / 0.7), 3);
            if (step < count) {
                for (let e = 0; e < step; e++) amounts[e] = 1;
                amounts[step] = ease;
                activeIdx = step;
            } else {
                const revStep = 2 * count - 1 - step;
                for (let l = 0; l < revStep; l++) amounts[l] = 1;
                amounts[revStep] = 1 - ease;
                activeIdx = revStep;
            }
        }
        return { amount: amounts, active: activeIdx };
    }

    function rotateRubikPoint(pt, moves, rotState) {
        let [x, y, z] = pt;
        let isActive = false;
        for (let i = 0; i < moves.length; i++) {
            if (rotState.amount[i] <= 0) continue;
            const move = moves[i];
            const coord = move.axis === 0 ? x : move.axis === 1 ? y : z;
            if (coord < move.lo || coord >= move.hi) continue;
            if (i === rotState.active) isActive = true;
            const ang = move.ang * rotState.amount[i];
            const cosA = Math.cos(ang), sinA = Math.sin(ang);
            if (move.axis === 0) {
                const ny = y * cosA - z * sinA;
                z = y * sinA + z * cosA;
                y = ny;
            } else if (move.axis === 1) {
                const nx = x * cosA + z * sinA;
                z = -x * sinA + z * cosA;
                x = nx;
            } else {
                const nx = x * cosA - y * sinA;
                y = x * sinA + y * cosA;
                x = nx;
            }
        }
        return [x, y, z, isActive];
    }

    function createRubikMoves(count) {
        const moves = [];
        for (let i = 0; i < count; i++) {
            const axis = Math.min(2, Math.floor(hash2D(i, 2.3) * 3));
            const lo = -1 + 0.5 * Math.min(3, Math.floor(hash2D(i, 5.9) * 4));
            const sign = hash2D(i, 7.7) < 0.5 ? 1 : -1;
            moves.push({ axis, lo, hi: lo + 0.5, ang: sign * Math.PI / 2 });
        }
        return moves;
    }

    function generateRubik(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.82;
        const proj = makeProjection(time * 0.55, 0.35 + 0.1 * Math.sin(time * 0.9), cx, cy, radius);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const moveCount = opts.moveCount || 14;
        const moves = createRubikMoves(moveCount);
        const rotState = getRubikRotation(time, moveCount, 0.42, 1.2);
        const dots = [];
        const latRings = opts.latRings || 15, lonDensity = opts.lonDensity || 40;

        for (let w = 0; w <= latRings; w++) {
            const phi = -Math.PI / 2 + w / latRings * Math.PI;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);
            const numLon = Math.max(1, Math.round(Math.abs(cosP) * lonDensity));
            for (let b = 0; b < numLon; b++) {
                const theta = b / numLon * 2 * Math.PI;
                const [rx, ry, rz, isActive] = rotateRubikPoint([cosP * Math.cos(theta), sinP, cosP * Math.sin(theta)], moves, rotState);
                const [sx, sy, sz] = proj(rx, ry, rz);
                const depth = (sz + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.6) + (opts.rDepth || 1.7) * depth + (isActive ? (opts.rActive || 0.3) : 0)) * scale,
                    white: (opts.inkFar || 0.62) - (opts.inkSpan || 0.54) * depth - (isActive ? 0.14 : 0)
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 4. Wave (listening)
    function generateWave(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.874;
        const proj = makeProjection(time * 0.18, 0.38, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const rings = opts.rings || 15, lonDensity = opts.lonDensity || 38;

        for (let p = 0; p <= rings; p++) {
            const phi = -Math.PI / 2 + p / rings * Math.PI;
            const cosP = Math.cos(phi), sinP = Math.sin(phi);
            const wave = 0.62 * Math.sin(time * 2.2 + phi * 3.5);
            const rMod = radius * (1 + 0.14 * wave);
            const numLon = Math.max(1, Math.round(Math.abs(cosP) * lonDensity));
            for (let y = 0; y < numLon; y++) {
                const theta = y / numLon * 2 * Math.PI;
                const [sx, sy, sz] = proj(cosP * Math.cos(theta) * rMod, sinP * rMod, cosP * Math.sin(theta) * rMod);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 0.7) + (opts.rDepth || 1.6) * depth) * scale,
                    white: 0.7 - 0.45 * depth,
                    a: 0.3 + 0.7 * depth
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 5. Web (connecting)
    function generateWeb(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.8;
        const proj = makeProjection(time * 0.25, 0.32, cx, cy, radius);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const nodeCount = opts.nodeN || 22;
        const nodes = [];
        const dots = [], lines = [];

        for (let i = 0; i < nodeCount; i++) {
            const base = fibonacciSpherePoint(i, nodeCount);
            const noiseX = smoothNoise2D(i * 0.31 + 9, time * 0.24) - 0.5;
            const noiseY = smoothNoise2D(i * 0.31 + 45, time * 0.24) - 0.5;
            const noiseZ = smoothNoise2D(i * 0.31 + 83, time * 0.24) - 0.5;
            const px = base[0] + 0.3 * noiseX * 2;
            const py = base[1] + 0.3 * noiseY * 2;
            const pz = base[2] + 0.3 * noiseZ * 2;
            const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
            const [sx, sy, sz] = proj(px / len, py / len, pz / len);
            const depth = (sz + 1) / 2;
            nodes.push({ x: sx, y: sy, z: sz, depth });
            dots.push({
                x: sx, y: sy, z: sz,
                r: ((opts.rBase || 1.4) + (opts.rDepth || 2.0) * depth) * scale,
                white: 0.6 - 0.4 * depth,
                a: 0.5 + 0.5 * depth
            });
        }

        // Generate connecting lines between close nodes
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = size * 0.38;
                if (dist < maxDist) {
                    const lineAlpha = (1 - dist / maxDist) * 0.6;
                    lines.push({
                        x1: nodes[i].x, y1: nodes[i].y,
                        x2: nodes[j].x, y2: nodes[j].y,
                        w: 1 * scale,
                        white: 0.65,
                        a: lineAlpha
                    });
                }
            }
        }
        return finalizeFrame(dots, lines, opts.rMin);
    }

    // 6. Braid (weaving)
    function generateBraid(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.76;
        const proj = makeProjection(time * 0.4, 0.3, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const ghostN = opts.ghostN || 150;

        for (let e = 0; e < ghostN; e++) {
            const pt = fibonacciSpherePoint(e, ghostN);
            const [sx, sy, sz] = proj(pt[0] * radius, pt[1] * radius, pt[2] * radius);
            const depth = (sz / radius + 1) / 2;
            dots.push({ x: sx, y: sy, z: sz, r: 0.8 * scale, white: 0.78, a: 0.1 + 0.22 * depth });
        }

        const strandN = opts.strandN || 52, turns = opts.turns || 3;
        for (let s = 0; s < 3; s++) {
            const phase = s / 3 * 2 * Math.PI;
            for (let r = 0; r < strandN; r++) {
                const yNorm = (fract(r / strandN + time * 0.045) * 2 - 1) * 0.96;
                const rNorm = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
                const edgeFade = Math.min(1, (1 - Math.abs(yNorm)) / 0.1);
                const angle = yNorm * Math.PI * turns + phase;
                const wave = 1 + 0.075 * Math.sin(yNorm * Math.PI * turns * 2 + phase * 2 + time * 0.8);
                const rad = rNorm * radius * wave;
                const [sx, sy, sz] = proj(Math.cos(angle) * rad, yNorm * radius * wave, Math.sin(angle) * rad);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 1.2) + (opts.rDepth || 1.8) * depth) * scale,
                    white: 0.55 - 0.45 * depth,
                    a: edgeFade * (0.45 + 0.55 * depth)
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 7. Ribbon (composing) & 8. Ring (breathing)
    function generateRibbonOrRing(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.78;
        const spin = opts.spin !== undefined ? opts.spin : 1;
        const proj = makeProjection(time * 0.1 * spin, 0.3, cx, cy, 1);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const lanes = opts.lanes || 7, segs = opts.segs || 50;

        for (let l = 0; l < lanes; l++) {
            const laneOffset = (l - (lanes - 1) / 2) * 0.08;
            for (let s = 0; s < segs; s++) {
                const theta = s / segs * 2 * Math.PI;
                const wave = 0.18 * Math.sin(theta * 3 - time * 1.7 + l * 0.22);
                const rad = radius * (0.75 + laneOffset + wave);
                const yPos = Math.sin(theta * 2 + time * 0.9) * radius * 0.35;
                const [sx, sy, sz] = proj(Math.cos(theta) * rad, yPos, Math.sin(theta) * rad);
                const depth = (sz / radius + 1) / 2;
                dots.push({
                    x: sx, y: sy, z: sz,
                    r: ((opts.rBase || 1.0) + (opts.rDepth || 1.8) * depth) * scale,
                    white: 0.6 - 0.45 * depth,
                    a: 0.4 + 0.6 * depth
                });
            }
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    // 9. Morph (shaping)
    function generateMorph(size, time, opts) {
        const cx = size / 2, cy = size / 2, radius = size / 2 * 0.75 * (opts.spread || 1);
        const proj = makeProjection(time * 0.3, 0.32, cx, cy, radius);
        const scale = radiusScale(size, opts.rsPow !== undefined ? opts.rsPow : 0.6);
        const dots = [];
        const count = opts.count || 24;

        for (let i = 0; i < count; i++) {
            const base = fibonacciSpherePoint(i, count);
            const morph = Math.sin(time * 1.5 + i * 0.5) * 0.25;
            const px = base[0] * (1 + morph);
            const py = base[1] * (1 + morph);
            const pz = base[2] * (1 + morph);
            const [sx, sy, sz] = proj(px, py, pz);
            const depth = (sz + 1) / 2;
            dots.push({
                x: sx, y: sy, z: sz,
                r: ((opts.rBase || 1.6) + (opts.rDepth || 2.4) * depth) * scale,
                white: 0.5 - 0.4 * depth,
                a: 0.5 + 0.5 * depth
            });
        }
        return finalizeFrame(dots, [], opts.rMin);
    }

    const MODE_FRAMES = {
        orbits: generateOrbits,
        globe: generateGlobe,
        rubik: generateRubik,
        wave: generateWave,
        web: generateWeb,
        braid: generateBraid,
        ribbon: generateRibbonOrRing,
        ring: generateRibbonOrRing,
        morph: generateMorph
    };

    const STATE_TO_MODE = {
        working: 'orbits',
        searching: 'globe',
        solving: 'rubik',
        listening: 'wave',
        connecting: 'web',
        weaving: 'braid',
        composing: 'ribbon',
        breathing: 'ring',
        shaping: 'morph'
    };

    const PRESETS = {
        orbits: { 64: { speed: 1.885, count: 1, size: 1 }, 20: { speed: 3.9, count: 0.238, size: 2.4 } },
        globe: { 64: { speed: 2.015, count: 0.42, size: 1.15 }, 20: { speed: 2.665, count: 0.105, size: 1.75 } },
        rubik: { 64: { speed: 1.82, count: 0.35, size: 1.05 }, 20: { speed: 1.95, count: 0.088, size: 1.9 } },
        wave: { 64: { speed: 1.69, count: 0.35, size: 1.05 }, 20: { speed: 2.21, count: 0.07, size: 2.0 } },
        web: { 64: { speed: 3.315, count: 1.35, size: 0.95 }, 20: { speed: 6.63, count: 0.25, size: 1.52 } },
        braid: { 64: { speed: 1.625, count: 0.5, size: 1 }, 20: { speed: 2.75, count: 0.1125, size: 1.36 } },
        ribbon: { 64: { speed: 2.34, count: 0.25, size: 0.85 }, 20: { speed: 3.12, count: 0.051, size: 1.073 } },
        ring: { 64: { speed: 3.24, count: 0.25, size: 0.956 }, 20: { speed: 3.78, count: 0.028, size: 1.622 } },
        morph: { 64: { speed: 2.405, count: 0.702, size: 0.395 }, 20: { speed: 2.08, count: 0.53, size: 1.011 } }
    };

    function resolvePreset(state, size) {
        const mode = STATE_TO_MODE[state] || 'globe';
        const presetTable = PRESETS[mode] || PRESETS.globe;
        const preset = size <= 32 ? presetTable[20] : presetTable[64];
        return {
            mode,
            speed: (preset && preset.speed) || 2.0,
            opts: { rMin: 0.3 }
        };
    }

    /**
     * ThinkingOrb Controller Class
     */
    class ThinkingOrb {
        constructor(options = {}) {
            this.state = options.state || 'searching';
            this.size = options.size || 64;
            this.speed = options.speed || 1.0;
            this.dark = options.dark !== undefined ? options.dark : true;
            this.color = options.color || '#00f0ff'; // Brand cyan
            this.paused = Boolean(options.paused);
            this.target = options.target || null;

            this.canvas = null;
            this.ctx = null;
            this.animId = null;
            this.lastTime = 0;
            this.time = 0;
            this.observer = null;
            this.isVisible = true;

            if (this.target) {
                this.mount(this.target);
            }
        }

        mount(target) {
            const container = typeof target === 'string' ? document.querySelector(target) : target;
            if (!container) return;

            this.canvas = document.createElement('canvas');
            this.canvas.className = 'thinking-orb-canvas';
            this.ctx = this.canvas.getContext('2d');
            this.updateCanvasSize();

            container.appendChild(this.canvas);

            // Intersection Observer to pause when offscreen
            if (typeof IntersectionObserver !== 'undefined') {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        this.isVisible = entry.isIntersecting;
                    });
                }, { threshold: 0.05 });
                this.observer.observe(this.canvas);
            }

            this.startAnimation();
        }

        updateCanvasSize() {
            if (!this.canvas) return;
            const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
            this.canvas.width = Math.round(this.size * dpr);
            this.canvas.height = Math.round(this.size * dpr);
            this.canvas.style.width = this.size + 'px';
            this.canvas.style.height = this.size + 'px';
            this.canvas.style.display = 'inline-block';
            this.canvas.style.verticalAlign = 'middle';
            if (this.ctx) {
                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
        }

        startAnimation() {
            if (this.animId) return;
            this.lastTime = (typeof performance !== 'undefined' ? performance.now() : Date.now());

            const renderLoop = (now) => {
                const dt = Math.min(0.1, (now - this.lastTime) / 1000);
                this.lastTime = now;

                if (!this.paused && this.isVisible && (typeof document === 'undefined' || document.visibilityState !== 'hidden')) {
                    const preset = resolvePreset(this.state, this.size);
                    const speedMultiplier = (preset.speed || 2.0) * this.speed;
                    this.time += dt * speedMultiplier;

                    if (this.ctx) {
                        this.ctx.clearRect(0, 0, this.size, this.size);
                        const generator = MODE_FRAMES[preset.mode] || MODE_FRAMES.globe;
                        const frame = generator(this.size, this.time, preset.opts);
                        paintFrame(this.ctx, frame, this.dark, this.color);
                    }
                }

                if (typeof requestAnimationFrame !== 'undefined') {
                    this.animId = requestAnimationFrame(renderLoop);
                }
            };

            if (typeof requestAnimationFrame !== 'undefined') {
                this.animId = requestAnimationFrame(renderLoop);
            }
        }

        setState(newState) {
            if (STATE_TO_MODE[newState]) {
                this.state = newState;
            }
        }

        setSize(newSize) {
            this.size = newSize;
            this.updateCanvasSize();
        }

        setColor(newColor) {
            this.color = newColor;
        }

        pause() {
            this.paused = true;
        }

        play() {
            this.paused = false;
        }

        destroy() {
            if (this.animId && typeof cancelAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animId);
                this.animId = null;
            }
            if (this.observer && this.canvas) {
                this.observer.unobserve(this.canvas);
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            this.canvas = null;
            this.ctx = null;
        }

        static create(options = {}) {
            return new ThinkingOrb(options);
        }
    }

    
    // Custom Element <thinking-orb> support for declarative usage across HTML, React, and Vue
    if (typeof customElements !== 'undefined' && !customElements.get('thinking-orb')) {
        class ThinkingOrbElement extends HTMLElement {
            static get observedAttributes() {
                return ['state', 'size', 'speed', 'color', 'dark', 'paused'];
            }

            connectedCallback() {
                const state = this.getAttribute('state') || 'searching';
                const size = parseInt(this.getAttribute('size') || '64', 10);
                const speed = parseFloat(this.getAttribute('speed') || '1.0');
                const color = this.getAttribute('color') || '#00f0ff';
                const dark = this.getAttribute('dark') !== 'false';
                const paused = this.hasAttribute('paused');

                this.style.display = 'inline-flex';
                this.style.alignItems = 'center';
                this.style.justifyContent = 'center';

                this.orb = new ThinkingOrb({
                    target: this,
                    state,
                    size,
                    speed,
                    color,
                    dark,
                    paused
                });
            }

            disconnectedCallback() {
                if (this.orb) {
                    this.orb.destroy();
                    this.orb = null;
                }
            }

            attributeChangedCallback(name, oldValue, newValue) {
                if (!this.orb || oldValue === newValue) return;
                if (name === 'state') this.orb.setState(newValue);
                if (name === 'size') this.orb.setSize(parseInt(newValue, 10));
                if (name === 'speed') this.orb.speed = parseFloat(newValue);
                if (name === 'color') this.orb.setColor(newValue);
                if (name === 'paused') {
                    if (newValue !== null && newValue !== 'false') {
                        this.orb.pause();
                    } else {
                        this.orb.play();
                    }
                }
            }
        }

        customElements.define('thinking-orb', ThinkingOrbElement);
    }

    ThinkingOrb.MODES = MODE_FRAMES;
    ThinkingOrb.STATE_TO_MODE = STATE_TO_MODE;
    return ThinkingOrb;
});
