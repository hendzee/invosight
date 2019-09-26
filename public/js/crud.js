$(document).ready(function(){
    /** Get data when first load page */
    $.ajax({
        url: window.location.origin + '/api/invosight-user',
        type: 'GET',
        success: function(response){
            $.each(response, function(index, element) {
                $('tbody').append(
                '<tr><td>' + element.first_name + ' ' + element.last_name + '</td>' +
                '<td>' + element.address + '</td>' +
                '<td>' + element.email + '</td>' +
                '<td>' + element.contact + '</td>' +
                '<td><button class="btn btn-primary mr-2 edit-btn" data-id="' + element._id + '">Edit</button>' + 
                '<button id="delete-btn" class="btn btn-primary delete-btn" data-id="' + element._id + '">Remove</button></td></tr>'
                );
            });
        }
    })

    /** Save or create new user */
    $(document).on('click', '#store-btn', function(){
        var first_name = $('[name="first_name"]').val()
        var last_name = $('[name="last_name"]').val()
        var address = $('[name="address"]').val()
        var email = $('[name="email"]').val()
        var contact = $('[name="contact"]').val()

        if (first_name.length != 0){
            $.ajax({
                url: window.location.origin + '/api/invosight-user',
                type: 'POST',
                dataType: 'json',
                data: { first_name: first_name, last_name: last_name, address: address, email: email, contact: contact },
                success: function(response){
                    /** Append new data user to row */
                    $('tbody').append(
                        '<tr><td>' + response.first_name + ' ' + response.last_name + '</td>' +
                        '<td>' + response.address + '</td>' +
                        '<td>' + response.email + '</td>' +
                        '<td>' + response.contact + '</td>' +
                        '<td><button class="btn btn-primary edit-btn mr-2" data-id="' + response._id + '">Edit</button>' + 
                        '<button class="btn btn-primary" delete-btn data-id="' + response._id + '">Remove</button></td></tr>'
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
})