var loanOnholdReason = {
    el: {
        form: '#loan_onhold_reason_form',
        addButton: ".addReason",
        editButton: ".editReason",
        deleteButton: ".deleteReason",
        modal: '#loanOnholdReasonsModal',
        deleteLoanOnholdReasonModal: '#deleteLoanOnholdReasonModal',
        confirmDeleteLoanOnholdReasonButton: '.confirmDeleteLoanOnholdReasonButton',
    },
    data: {
        datatable: '',
    },
    init() {
        var _this = this;
        _this.validationForm(adminAjaxURL + 'loan-onhold-reasons', 'post');
        _this.bindUiActions();
    },
    bindUiActions() {
        var _this = this;
        _this.data.datatable = $('#datatable').DataTable({
            processing: true,
            serverSide: true,
            ajax: {
                "url": adminAjaxURL + 'datatable-loan-onhold-reasons',
            },
            columns: [
                {data: 'id', name: 'id', visible: false},
                {data: 'title', name: 'title'},
                {data: 'title_es', name: 'title_es'},
                {data: 'title_nl', name: 'title_nl'},
                {data: 'action', name: 'action', orderable: false, searchable: false},
            ],
            order: [[0, 'desc']],
            drawCallback(settings) {
                initTooltip();
            },
        });

        $(document).on('click', _this.el.addButton, function (e) {
            e.preventDefault();
            _this.formReset();
            $(_this.el.modal).modal('show');
        });

        $(document).on('click', _this.el.editButton, function (e) {
            e.preventDefault();
            _this.formReset();
            _this.setEdit($(this).data('id'), $(this).data('type'));
        });

        $(document).on('click', _this.el.deleteButton, function (e) {
            e.preventDefault();
            $(_this.el.deleteLoanOnholdReasonModal).find(_this.el.confirmDeleteLoanOnholdReasonButton).data('id', $(this).data('id'));
            $(_this.el.deleteLoanOnholdReasonModal).modal('show');
        });

        $(document).on('click', _this.el.deleteLoanOnholdReasonModal + ' ' + _this.el.confirmDeleteLoanOnholdReasonButton, function (e) {
            e.preventDefault();
            $.ajax({
                dataType: 'json',
                method: 'delete',
                url: adminAjaxURL + 'loan-onhold-reasons/' + $(this).data('id'),
                success: function (data) {
                    _this.data.datatable.draw();
                    $(_this.el.deleteLoanOnholdReasonModal).modal('hide');
                }
            })
        });

    },
    formReset() {
        var _this = this;
        $(_this.el.form).find('[name="id"]').val('');
        $(_this.el.form).find('input').prop('disabled', false);
        $(_this.el.form).find('button[type="submit"]').show();
        $(_this.el.form)[0].reset();
    },
    setEdit(id, type) {
        var _this = this
        $.ajax({
            dataType: 'json',
            method: 'get',
            url: adminAjaxURL + 'loan-onhold-reasons/' + id + '/edit',
            success(data) {
                setForm(_this.el.form, data['inputs']);
                if (type == 'view') {
                    $(_this.el.form).find('input').prop('disabled', true);
                    $(_this.el.form).find('button[type="submit"]').hide();
                }
                $(_this.el.modal).modal('show');
            }
        })
    },
    validationForm(url, method) {
        var _this = this;
        $(_this.el.form).data('validator', null);
        $(_this.el.form).unbind();

        validator = $(_this.el.form).validate({
            rules: {
                'title': {required: true},
                'title_es': {required: true},
                'title_nl': {required: true},
            },

            errorPlacement(error, element) {
                $('span[for="' + $(element).attr('name') + '"]').html(error);
                $(element).removeClass('error');
            },

            submitHandler(form) {
                $.ajax({
                    dataType: 'json',
                    method: method,
                    url: url,
                    data: $(form).serialize(),
                    success: function (data) {
                        _this.data.datatable.draw();
                        $(_this.el.modal).modal('hide');
                    }
                })
            }
        });
    }
};