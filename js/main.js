$(function () {
    var error;
    var ucretler;

    function validate() {
        var value = $(this).val();
        if (value == "Seçiniz" || value == "") {
            $(this).parent().addClass('has-error').shake({
                distance: 10,
                speed: 100,
                times: 1
            });
            error = true;
        } else {
            $(this).parent().removeClass('has-error');
        }
    }

    $.getJSON("http://api.itu24.com/fakulteler.json", function (response) {
        var options = "";
        response.forEach(function (fakulte) {
            options += $("<option></option>").val(fakulte["no"]).html(fakulte["adi"]).prop('outerHTML');
        });
        options += $("<option></option>").val("yuksek").html("Yüksek Lisans").prop('outerHTML');
        options += $("<option></option>").val("doktora").html("Doktora").prop('outerHTML');
        $("#form_fakulte").append(options);
    });

    $.getJSON("js/ucretler.json", function (response) {
        ucretler = response;
    });

    $('#harc-hesaplayici input, #harc-hesaplayici select').blur(validate);

    $('#harc-hesaplayici').submit(function (e) {
        var uyruk = $('input[name="uyruk"]:checked').val();
        var fakulte = $('select[name="fakulte"]').val();
        var uzatma = $('input[name="uzatma"]:checked').val();
        var kredi = parseInt($('input[name="kredi"]').val());

        error = false;
        $('#harc-hesaplayici input, #harc-hesaplayici select').each(validate);
        if (error) {
            e.preventDefault();
            return;
        }

        var ucret;
        var muaf = false;

        if (kredi == 0) {
            ucret = 0;
        } else if (uyruk == "tc" && uzatma == "hayir") {
            ucret = 0;
            muaf = true;
        } else {
            ucret = ucretler["donemlik"][uyruk][fakulte] + kredi * ucretler["kredilik"][uyruk][fakulte];
        }

        if (muaf) {
            $("#ucret").html("Program süresince katkı payından muafsınız.");
        } else {
            $("#ucret").html("Ödeyeceğiniz katkı payı ücreti: <strong>\u20BA " + ucret.toFixed(2) + "</strong>");
        }
        $("#ucretModal").modal();

        e.preventDefault();
    })
});
