/// <reference path="../../../node_modules/@types/sinon/index.d.ts" />
import * as sinon from 'sinon';
import * as chai from 'chai';
const expect = chai.expect;

import OctoRef from '../../../src/lib/core';
import config from '../../../src/config';

describe('core', function(){
    const pathname = 'http://url.com';

    const defMock = {
        isCodePage: () => true,
        subscribe: ()=> null,
        getFileContent: () => 'fileContent',
    }
    const makeMockAdapter = (customProps = {}) => ({...defMock, ...customProps})


    it('constructor should create instance', function() {
        const spySubscribe = sinon.spy();
        const spySend = sinon.spy();

        const mockAdapter = makeMockAdapter({
            subscribe: spySubscribe
        })

        OctoRef.prototype.send = spySend;
        new OctoRef(mockAdapter, config, pathname);

        expect(spySubscribe.calledWith('click')).to.be.ok;
        expect(spySend.calledWith('register', { content: 'fileContent', url: pathname })).to.be.ok;
    });

    it('#findDefinition ', function() {
        const line = 3;
        const character = 5;

        const spySend = sinon.spy();

        const mockAdapter = makeMockAdapter({
            getSelectedElemPosition: () => ({ line, character })
        })

        OctoRef.prototype.send = spySend;
        var instance = new OctoRef(mockAdapter, config, pathname);
        instance.findDefinition();
        // content: this.domAPI.getFileContent()

        expect(spySend.calledWith(
            'definition',
            {
                end: { line, character },
                url: pathname,
                content: 'fileContent'
            }
        )).to.be.ok;
    });

    it('#highlight', function() {
        const actionToDo = {};
        const currentPosition = {};
        const spyHighlight = sinon.spy();

        const mockAdapter = makeMockAdapter({
            highlight: spyHighlight,
            normalizeToAdapterFormat: f => f
        })

        var instance = new OctoRef(mockAdapter, config, pathname);

        const data = {start: 'start', end: 'end'};
        instance.highlight(actionToDo, [data], currentPosition); // FIXME

        expect(spyHighlight.calledOnce).to.be.ok;
        expect(spyHighlight.calledWith(data)).to.be.ok;
    });

    it('click + altKey should lead to findDefinition call', function() {
        const mockAdapter = makeMockAdapter();

        const instance = new OctoRef(mockAdapter, config, pathname);
        const findDefStub = sinon.stub(instance, 'findDefinition');

        instance.handleClick({});
        expect(findDefStub.notCalled).to.be.ok;

        instance.handleClick({});
        expect(findDefStub.notCalled).to.be.ok;

        instance.handleClick({altKey: true});
        expect(findDefStub.calledOnce).to.be.ok;
    });
})
