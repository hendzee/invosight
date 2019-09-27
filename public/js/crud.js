/** This file is function collection to handle CRUD (Create, Read, Update, Delete)
 *  to the database.
 *  writer: Virginia Hendras Prawira
 *  email: hendzcode@gmail.com
 */

$(document).ready(function(){
    /** Get data when first load page */
    $.ajax({
        url: window.location.origin + '/api/invosight-user',
        type: 'GET',
        success: function(response){
            $.each(response.users, function(index, element) {
                $('tbody').append(
                '<tr><td><input type="checkbox" name="del-id-list[]" class="mr-2" value="' + element._id + '">' +
                element.first_name + ' ' + element.last_name + '</td>' +
                '<td>' + element.address + '</td>' +
                '<td>' + element.email + '</td>' +
                '<td>' + element.contact + '</td>' +
                '<td><button class="btn btn-primary mr-2 edit-btn btn-sm" data-id="' + element._id + '"><i class="fas fa-pen"></i></button>' + 
                '<button id="delete-btn" class="btn btn-danger delete-btn btn-sm" data-id="' + element._id + '"><i class="fas fa-trash"></i></button></td></tr>'
                );
            });

            if (response.pageWillShow > 0){
                /** Set pagination start */
                for (i=0; i<response.pageWillShow; i++){
                    
                    if (i===0){
                        $('.pagination').append('<li class="page-item page-number active"><div class="page-link">' + (i+1) + '</div></li>');
                    }else{
                        $('.pagination').append('<li class="page-item page-number"><div class="page-link">' + (i+1) + '</div></li>');
                    }
                }
                /** Set pagination end */
            }
        }
    })

    /** Add active class to selected page button */
    $(document).on('click', '.page-number', function(){
        $('.page-number').removeClass('active');
        $(this).addClass('active');
    })

    /** Check and uncheck all list data */
    $(document).on('click', '[name="del-all[]"]', function(){
        if ($('[name="del-all[]"]').is(":checked")){
            $('[name="del-id-list[]"]').prop('checked', true);
            /** Show bulk delete button */
            $('#bulk-delete-btn').fadeIn(300)
                .removeClass('d-none')
                .hide()
                .show();
        }else{
            $('[name="del-id-list[]"]').prop('checked', false);
            /** Hide bulk delete button */
            $('#bulk-delete-btn').fadeOut(300);
        }
    })

    /** Show and hide bulk-delete button*/
    $(document).on('click', '[name="del-id-list[]"]', function(){
        if ($('[name="del-id-list[]"]:checked').length > 0){
            /** Show bulk delete button */
            $('#bulk-delete-btn')
                .removeClass('d-none')
                .hide()
                .fadeIn(300).show();
        }else{
            /** Hide bulk delete button */
            $('#bulk-delete-btn').fadeOut(300);
        }
    })

    /** Show confirmation to bulk delete */
    $(document).on('click', '#bulk-delete-btn', function(){
        $('#bulkDeleteModal').modal('show');
    })

    /** Confirm bulk delete */
    $(document).on('click','#confirm-bulk-delete-btn', function(){
        $.each($('[name="del-id-list[]"]:checked'), function(){
            var id = ($(this).val())
            $(this).closest('tr').remove();

            $.ajax({
                url: window.location.origin + '/api/invosight-user/' + id,
                type: 'DELETE',
            })
        })

        $('#bulkDeleteModal').modal('hide');
    })

    /** Refresh page */
    $(document).on('click', '#refresh-btn', function(){
        location.reload(true);
    })

    /** Save or create new user */
    $(document).on('click', '#store-btn', function(){
        var first_name = $('[name="first_name"]').val()
        var last_name = $('[name="last_name"]').val()
        var address = $('[name="address"]').val()
        var email = $('[name="email"]').val()
        var contact = $('[name="contact"]').val()

        if (first_name.length != 0 && last_name.length != 0 && address.length !=0 &&
                email.length !=0 && contact.length !=0 ){
            $.ajax({
                url: window.location.origin + '/api/invosight-user',
                type: 'POST',
                dataType: 'json',
                data: { first_name: first_name, last_name: last_name, address: address, email: email, contact: contact },
                success: function(response){
                    /** Append new data user to row */
                    $('tr').removeClass('bg-info');
                    $('tr').removeClass('text-white');
                    $('.badge').remove();

                    $('tbody').prepend(
                        '<tr class="bg-info text-white"><td>' + '<input type="checkbox" name="del-id-list[]" class="mr-2" value="' + response._id + '">' +
                        response.first_name + ' ' + response.last_name + '<br><span class="badge badge-light">New</span></td>' +
                        '<td>' + response.address + '</td>' +
                        '<td>' + response.email + '</td>' +
                        '<td>' + response.contact + '</td>' +
                        '<td><button class="btn btn-primary mr-2 edit-btn btn-sm" data-id="' + response._id + '"><i class="fas fa-pen"></i></button>' + 
                        '<button id="delete-btn" class="btn btn-danger delete-btn btn-sm" data-id="' + response._id + '"><i class="fas fa-trash"></i></button></td></tr>'
                    );
    
                    $('#createModal').modal('hide');
                },
                error: function (request, status, error) {
                    var jsonResponse = JSON.parse(request.responseText);
                    
                    $('.alert').text(jsonResponse.message);
                    $('.alert').removeClass('d-none');
                }
            })
        }else {
            $('.alert').text('data must be filled all');
            $('.alert').removeClass('d-none');
        }
    })
    
    /** Show edit form data user */
    var parent;
    $(document).on('click', '.edit-btn', function(){
        parent = $(this).closest('tr');

        var id = $(this).data('id');
        var first_name = $('[name="upd_first_name"]');
        var last_name = $('[name="upd_last_name"]');
        var address = $('[name="upd_address"]');
        var email = $('[name="upd_email"]');
        var contact = $('[name="upd_contact"]');
        
        $('[name="id"]').val(id);
        $('#editModal').modal('show');

        $.ajax({
            url: window.location.origin + '/api/invosight-user/' + id,
            type: 'GET',
            success: function(response){
                first_name.val(response.first_name)
                last_name.val(response.last_name)
                address.val(response.address)
                email.val(response.email)
                contact.val(response.contact)
            }
        })
    })

    /** Update user data */
    $(document).on('click', '#update-btn', function(){
        var id = $('[name="id"]').val();
        var first_name = $('[name="upd_first_name"]').val()
        var last_name = $('[name="upd_last_name"]').val()
        var address = $('[name="upd_address"]').val()
        var email = $('[name="upd_email"]').val()
        var contact = $('[name="upd_contact"]').val()
        
        $.ajax({
            url: window.location.origin + '/api/invosight-user/' + id,
            type: 'PUT',
            dataType: 'json',
            data: { first_name: first_name, last_name: last_name, address: address, email: email, contact: contact },
            success: function(response){

                /** Update data on row */
                $(parent).find('td:nth-child(1)').text(response.first_name + ' ' + response.last_name);
                $(parent).find('td:nth-child(2)').text(response.address);
                $(parent).find('td:nth-child(3)').text(response.email);
                $(parent).find('td:nth-child(4)').text(response.contact);

                $('#editModal').modal('hide');
            },
            error: function (request, status, error) {
                var jsonResponse = JSON.parse(request.responseText);
                
                $('.alert').text(jsonResponse.message);
                $('.alert').removeClass('d-none');
            }
        })
    })

    /** Show confirmation to delete selected user */
    $(document).on('click', '.delete-btn', function(){
        parent = $(this).closest('tr');

        $('[name="del_id"]').val($(this).data('id'));
        $('#deleteModal').modal('show');
    })

    /** Confirm to delete selected user */
    $(document).on('click', '#confirm-delete-btn', function(){
        var id = $('[name="del_id"]').val();

        $.ajax({
            url: window.location.origin +  '/api/invosight-user/' + id,
            type: 'DELETE',
            success: function(response){
                parent.remove();
                $('#deleteModal').modal('hide');
            },
            error: function (request, status, error) {
                var jsonResponse = JSON.parse(request.responseText);
                
                $('.alert').text(jsonResponse.message);
                $('.alert').removeClass('d-none');
            }
        });
    })

    /** Pagination function handler */
    $(document).on('click', '.page-item', function(){
        var page = $(this).text();

        $.ajax({
            url: window.location.origin + '/api/invosight-user/page/' + page,
            type: 'GET',
            success: function(response){
                $('tbody').empty();
                $.each(response, function(index, element) {
                    $('tbody').append(
                    '<tr><td>' + element.first_name + ' ' + element.last_name + '</td>' +
                    '<td>' + element.address + '</td>' +
                    '<td>' + element.email + '</td>' +
                    '<td>' + element.contact + '</td>' +
                    '<td><button class="btn btn-primary mr-2 edit-btn btn-sm" data-id="' + element._id + '"><i class="fas fa-pen"></i></button>' + 
                    '<button id="delete-btn" class="btn btn-danger delete-btn btn-sm" data-id="' + element._id + '"><i class="fas fa-trash"></i></button></td></tr>'
                    );
                });
            }
        })
    })
})