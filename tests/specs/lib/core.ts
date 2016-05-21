import OctoRef from '../../../src/lib/core';
const config = require('../../../src/config.json');

import chai = require('chai');
const expect = chai.expect;

describe('core', function(){
    it('constructor should create instance', function() {
        const spySubscribe = sinon.spy();
        const spySend = sinon.spy();
        const Adapter = {
            isCodePage: () => true,
            subscribe: spySubscribe,
            getFileContent: () => 'fileContent'
        }
        OctoRef.prototype.send = spySend;
        const stub = sinon.stub().returns(Adapter)
        const root = {};
        new OctoRef(root, stub, config);
        expect(stub.calledWithNew).to.be.ok;
        expect(spySubscribe.calledWith('click')).to.be.ok;
        expect(spySend.calledWith('register', {content: 'fileContent'})).to.be.ok;
    });

    it('#findDefinition ', function() {
        const line = 3;
        const character = 5;
        const spyClean = sinon.spy();
        const spySend = sinon.spy();
        const mockAdapter = function () {
            return {
                isCodePage: () => false, // to prevent subscibe
                clean: spyClean,
                getElem: () => {},
                getLineNumber: () => line,
                getEndColumnPosition: () => character
            };
        }

        OctoRef.prototype.send = spySend;
        const root = {};
        var instance = new OctoRef(root, mockAdapter, config);
        instance.findDefinition();

        expect(spyClean.calledOnce).to.be.ok;
        expect(spySend.calledWith('definition', { end: { line, character } })).to.be.ok;
    });

    it('#showDefinition ', function() {
        const spyShow = sinon.spy();
        const mockAdapter = function () {
            return {
                isCodePage: () => false,
                show: spyShow
            };
        }

        OctoRef.prototype.send = () => null;
        const root = {};
        var instance = new OctoRef(root, mockAdapter, config);

        const data = {start: 'start', end: 'end'};
        instance.showDefinition([data]);

        expect(spyShow.calledOnce).to.be.ok;
        expect(spyShow.calledWith(data)).to.be.ok;
    });

    it('click + altKey should lead to findDefinition call', function() {
        const mockAdapter = function () {
            return {
                isCodePage: () => true,
                subscribe: ()=> null,
                clean: () => null,
                getFileContent: () => 'fileContent',
                getElem: () => {},
                getLineNumber: () => null,
                getEndColumnPosition: () => null
            };
        }

        OctoRef.prototype.send = () => null;
        const root = {};
        const instance = new OctoRef(root, mockAdapter, config);
        const stub = sinon.stub(instance, 'findDefinition');
        instance.clickHandler({});
        expect(stub.notCalled).to.be.ok;

        instance.clickHandler({});
        expect(stub.notCalled).to.be.ok;

        instance.clickHandler({altKey: true});
        expect(stub.calledOnce).to.be.ok;
    });
})
